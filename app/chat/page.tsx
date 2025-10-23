"use client";

import { PanelLeftClose, PanelLeftOpen, FilePenLine, Eye } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { endpoints } from "@/app/api/route-helper";
import { safeParseContent } from "@/lib/utils";
import { generateSVG } from "@/components/Avatar/generator";
import { UserContext } from "@/contexts/userContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/UI/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ConversationRow } from "@/components/ConversationRow";
import FocusModeOverlay from "./FocusModeOverlay";

// -----------------------------
// Types
// -----------------------------

type ChatMessageBase = {
    id?: string;
    createdAt?: string;
    role: "USER" | "ASSISTANT";
    content: string;
};

export type ChatMessage = ChatMessageBase & {
    parsed?: ChatParsedContent;
};

export type ChatParsedContent =
    | { type: "clarification"; message: string }
    | { type: "plan"; plan: string; tasks: Task[] }
    | { type: "user"; message: string };

export type Task = {
    id: string;
    description: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    dueDate?: string;
};

export type Conversation = {
    id: number;
    title: string;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
    sessionId?: string;
};

// -----------------------------
// Page
// -----------------------------

export default function Page() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [allConversations, setAllConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Focus Mode state
    const [focusMode, setFocusMode] = useState(false);
    const [focusTitle, setFocusTitle] = useState("");
    const [focusTasks, setFocusTasks] = useState<Task[]>([]);
    const [editMode, setEditMode] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const router = useRouter();
    const userContextInstance = useContext(UserContext);

    useEffect(() => {
        getAllConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            // Fetch messages for the selected conversation
            axios
                .get<{ data: ChatMessage[] }>(`${endpoints.chat.allChat.get}/${selectedConversation.id}`)
                .then((res) => {
                    setMessages(res.data.data);
                })
                .catch((err) => {
                    console.error("Error fetching messages:", err);
                });
        } else {
            setMessages([]);
        }
    }, [selectedConversation]);

    // Extract latest plan (if any) from messages
    const latestPlan = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            const m = messages[i];
            const parsed = m.parsed ?? safeParseContent(m.content);
            if (parsed?.type === "plan") {
                return parsed as { type: "plan"; plan: string; tasks: Task[] };
            }
        }
        return null;
    }, [messages]);

    // Auto-enter focus mode when a plan arrives
    useEffect(() => {
        if (latestPlan) {
            setFocusTitle(latestPlan.plan);
            setFocusTasks(latestPlan.tasks ?? []);
        }
    }, [latestPlan]);

    const getAllConversations = async () => {
        const res = await axios.get<{ data: Conversation[] }>(endpoints.chat.allChat.get);
        setAllConversations(
            res.data.data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        );
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMessages: ChatMessage[] = [...messages, { role: "USER", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        const res = await axios.post(endpoints.plan.aiGenerate.post, {
            body: input,
            conversationId: selectedConversation?.id,
            sessionId: selectedConversation?.sessionId,
        });

        const json = res.data.data;
        const { type } = json.data;

        let aiMessage: ChatMessage;
        if (type === "clarification") {
            aiMessage = {
                role: "ASSISTANT",
                content: json.data.message,
                parsed: { type: "clarification", message: json.data.message },
            };
        } else if (type === "plan") {
            aiMessage = {
                role: "ASSISTANT",
                content: json.data.plan,
                parsed: { type: "plan", plan: json.data.plan, tasks: json.data.tasks },
            };
        } else {
            aiMessage = {
                role: "ASSISTANT",
                content: "Sorry, I could not understand.",
            };
        }

        setMessages((prev) => [...prev, aiMessage]);
        setLoading(false);

        // Enter focus mode automatically if a plan is generated
        if (type === "plan") {
            setFocusTitle(json.data.plan);
            setFocusTasks(json.data.tasks ?? []);
            setFocusMode(true);
            setSidebarVisible(false);
        }

        if (!selectedConversation && json.conversationId) {
            const newConv = {
                id: json.conversationId,
                title: json.data.plan?.title || "Untitled",
                archived: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: 0,
                sessionId: json.sessionId,
            } as Conversation;
            setAllConversations((prev) => [newConv, ...prev]);
            await getAllConversations();
            setSelectedConversation(allConversations.find((c) => c.id === json.conversationId) || newConv);
        }
    };

    // Keyboard shortcuts: F to toggle focus, ESC to exit
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "f" && e.ctrlKey) {
                if (latestPlan) {
                    setFocusMode((s) => !s);
                    if (!focusMode) setSidebarVisible(false);
                }
            }
            if (e.key === "Escape") {
                setFocusMode(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [latestPlan, focusMode]);

    // Update a task's status inline
    const cycleStatus = (t: Task): Task => {
        const order: Task["status"][] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
        const next = order[(order.indexOf(t.status) + 1) % order.length];
        return { ...t, status: next };
    };

    const updateTaskStatus = (taskId: string) => {
        setFocusTasks((prev) => prev.map((t) => (t.id === taskId ? cycleStatus(t) : t)));
    };

    const renameTask = (taskId: string, description: string) => {
        setFocusTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, description } : t)));
    };

    const saveAdjustments = async () => {
        try {
            await axios.put(endpoints.plan.update?.put(selectedConversation?.id ?? 0), {
                conversationId: selectedConversation?.id,
                plan: focusTitle,
                tasks: focusTasks,
            });
        } catch (e) {
            // Silently ignore if endpoint not implemented; user still keeps local edits.
            console.warn("apply-adjustments endpoint not found/failed", e);
        }
        setEditMode(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#18181b] text-gray-100">
            {/* Sidebar */}
            <div
                className={`hidden md:flex h-screen flex-col transition-all duration-300 border-r border-gray-800 bg-[#23232a] ${sidebarVisible && !focusMode ? "w-64" : "w-0"
                    }`}
                aria-hidden={!sidebarVisible || focusMode}
            >
                <div
                    className={`flex h-full w-full flex-col px-4 py-4 transition-opacity duration-300 ${sidebarVisible && !focusMode ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-400">Conversations</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarVisible(false)}
                            className="text-gray-400"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mb-2">
                        <Button className="w-full justify-start gap-2 hover:bg-gray-700 text-gray-300" onClick={() => setSelectedConversation(null)}>
                            <FilePenLine className="h-4 w-4" />
                            New Conversation
                        </Button>
                    </div>
                    <div className="mb-2">
                        <Button className="w-full justify-start gap-2 hover:bg-gray-700 text-gray-300" onClick={() => router.push("/flow")}>
                            <Eye />
                            View Flow
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pb-2">
                        {allConversations.map((conv) => (
                            <ConversationRow
                                key={conv.id}
                                conv={conv}
                                active={selectedConversation?.id === conv.id}
                                onSelect={setSelectedConversation}
                                onArchive={() => { }}
                                onDelete={() => { }}
                            />
                        ))}
                    </div>

                    <div className="mt-auto pt-2 border-t border-gray-800 mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex w-full items-center">
                                <div className="flex w-full items-center justify-between rounded-sm px-2 py-2 hover:bg-gray-700">
                                    <h4 className="flex-1 text-left text-gray-200">{userContextInstance.user?.name}</h4>
                                    <div className="ml-2 shrink-0">
                                        {generateSVG(userContextInstance.user?.name ?? "", { size: 32, rounded: true })}
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-0 w-[var(--radix-dropdown-menu-trigger-width)] bg-[#23232a] border border-gray-800">
                                <DropdownMenuItem
                                    onClick={() => {
                                        axios.post(endpoints.auth.logout.post).then(() => {
                                            userContextInstance.clearUser();
                                            router.push("/login");
                                        });
                                    }}
                                    className="text-gray-200"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {!sidebarVisible && !focusMode && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarVisible(true)}
                    className="absolute top-8 left-4 z-50 text-gray-400 hidden md:flex"
                >
                    <PanelLeftOpen className="w-4 h-4" />
                </Button>
            )}

            {/* Main Content */}
            <div className="flex-1 relative flex flex-col overflow-hidden">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-2xl font-semibold text-gray-400 mb-4">What do you want to plan today?</h1>
                        <div className="w-full max-w-xl flex gap-2">
                            <Textarea
                                ref={inputRef}
                                rows={1}
                                className="flex-1 resize-none rounded-md border border-gray-700 bg-[#23232a] text-gray-100 shadow-sm"
                                placeholder="Describe your plan..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <Button onClick={sendMessage} disabled={loading} className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                                Send
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === "USER";
                                const content = safeParseContent(msg.content);
                                return (
                                    <div key={idx} className={`flex items-start space-x-2 ${isUser ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-md p-3 rounded-lg text-sm ${isUser ? "bg-gray-700 text-gray-100" : "bg-gray-800 text-gray-200"}`}>
                                            {content.type === "plan" ? (
                                                <div>
                                                    <strong>Plan:</strong> {content.plan}
                                                    <ul className="mt-2 space-y-1">
                                                        {content.tasks.map((task: Task) => (
                                                            <li key={task.id} className="flex items-center">
                                                                <span
                                                                    className={`inline-block w-2 h-2 mr-2 rounded-full ${task.status === "COMPLETED"
                                                                        ? "bg-green-500"
                                                                        : task.status === "IN_PROGRESS"
                                                                            ? "bg-yellow-500"
                                                                            : task.status === "PENDING"
                                                                                ? "bg-red-500"
                                                                                : "bg-gray-400"
                                                                        }`}
                                                                ></span>
                                                                {task.description} {task.dueDate && `(${new Date(task.dueDate).toLocaleDateString()})`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap text-start">{content.message}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="flex items-start space-x-2 justify-start">
                                    <div className="max-w-md p-3 rounded-lg text-sm text-gray-200 animate-pulse">
                                        <span className="italic text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full border-t border-gray-800 bg-[#23232a] px-4 py-3 flex gap-2 items-center">
                            <Textarea
                                rows={1}
                                className="flex-1 resize-none rounded-md border border-gray-700 bg-[#23232a] text-gray-100 shadow-sm"
                                placeholder="Describe your plan..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <Button onClick={sendMessage} disabled={loading} className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                                Send
                            </Button>
                            {/* Focus toggle appears when there's a plan */}
                            {latestPlan && (
                                <Button variant="secondary" onClick={() => { setFocusMode(true); setSidebarVisible(false); }} title="Focus (F)" className="bg-gray-800 text-gray-100 hover:bg-gray-700">
                                    Focus Mode
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Focus Mode Overlay */}
            {focusMode && (
                <FocusModeOverlay
                    focusTitle={focusTitle}
                    focusTasks={focusTasks}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    updateTaskStatus={updateTaskStatus}
                    renameTask={renameTask}
                    saveAdjustments={saveAdjustments}
                    setFocusTasks={setFocusTasks}
                    setFocusTitle={setFocusTitle}
                    setFocusMode={setFocusMode}
                />
            )}
        </div>
    );
}
