'use client'

import { PanelLeftClose, PanelLeftOpen, FilePenLine } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Textarea } from '@/components/UI/textarea'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { endpoints } from '@/app/api/route-helper'

type ChatMessageBase = {
    id?: string // 可选：数据库 ID
    createdAt?: string
    role: "USER" | "ASSISTANT"
    content: string
}

export type ChatMessage = ChatMessageBase & {
    parsed?: ChatParsedContent
}

type ChatParsedContent =
    | { type: 'clarification'; message: string }
    | { type: 'plan'; plan: string; tasks: Task[] }
    | { type: "user", message: string }

type Task = {
    id: string
    description: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
}


interface Conversation {
    id: number
    title: string
    archived: boolean
    createdAt: string
    updatedAt: string
    userId: number
}

export default function Page() {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [allConversations, setAllConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null)
    const [sidebarVisible, setSidebarVisible] = useState(true)

    useEffect(() => {
        getAllConversations()
    }, [])

    useEffect(() => {
        if (selectedConversation) {
            // Fetch messages for the selected conversation
            axios.get<ChatMessage[]>(`${endpoints.chat.allChat.get}/${selectedConversation.id}`)
                .then(res => {
                    setMessages(res.data)
                })
                .catch(err => {
                    console.error('Error fetching messages:', err)
                })
        } else {
            setMessages([])
        }
    }, [selectedConversation])

    async function getAllConversations() {
        const res = await axios.get<Conversation[]>(endpoints.chat.allChat.get)
        setAllConversations(res.data)
    }

    const sendMessage = async () => {
        if (!input.trim()) return
        const newMessages: ChatMessage[] = [...messages, { role: 'USER', content: input }]
        setMessages(newMessages)
        setInput('')
        setLoading(true)

        const res = await axios.post(endpoints.plan.aiGenerate.post, {
            body: input,
            conversationId: selectedConversation?.id
        })

        const json = res.data
        const { type } = json.data

        let aiMessage: ChatMessage
        if (type === 'clarification') {
            aiMessage = {
                role: 'ASSISTANT',
                content: json.data.message,
                parsed: { type: 'clarification', message: json.data.message }
            }
        } else if (type === 'plan') {
            aiMessage = {
                role: 'ASSISTANT',
                content: json.data.plan,
                parsed: { type: 'plan', plan: json.data.plan, tasks: json.data.tasks }
            }
        } else {
            aiMessage = {
                role: 'ASSISTANT',
                content: 'Sorry, I could not understand.'
            }
        }

        setMessages((prev) => [...prev, aiMessage])
        setLoading(false)

        if (!selectedConversation && json.conversationId) {
            const newConv = {
                id: json.conversationId,
                title: json.data.plan?.title || 'Untitled',
                archived: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: 0
            }
            setAllConversations((prev) => [newConv, ...prev])
            setSelectedConversation(newConv)
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div
                className={`
          hidden md:block transition-all duration-300 border-r bg-background
          ${sidebarVisible ? 'w-64' : 'w-0'}
        `}
            >
                <div
                    className={`
            h-full overflow-y-auto px-4 py-4 transition-opacity duration-300
            ${sidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
                >
                    <div className="flex justify-between items-center mb-4 text-start">
                        <h2 className="text-sm font-semibold text-muted">Conversations</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarVisible(false)}
                            className="text-muted-foreground"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className='w-full flex justify-start items-center mb-2'>

                            <Button
                                className="hover:bg-muted text-muted-foreground "
                                onClick={() => setSelectedConversation(null)}
                            >
                                <FilePenLine />
                            </Button>
                        </div>
                        {allConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-2 rounded cursor-pointer text-start text-sm ${selectedConversation?.id === conv.id ? 'bg-muted' : 'hover:bg-muted'
                                    }`}
                            >
                                {conv.title}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {!sidebarVisible && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarVisible(true)}
                    className="absolute top-8 left-4 z-50 text-muted-foreground hidden md:flex"
                >
                    <PanelLeftOpen className="w-4 h-4" />
                </Button>
            )}

            {/* Main Content */}
            <div className="flex-1 relative flex flex-col overflow-hidden">

                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-2xl font-semibold text-muted-foreground mb-4">
                            What do you want to plan today?
                        </h1>
                        <div className="w-full max-w-xl flex gap-2">
                            <Textarea
                                rows={1}
                                className="flex-1 resize-none rounded-md border border-input bg-background shadow-sm"
                                placeholder="Describe your plan..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        sendMessage()
                                    }
                                }}
                            />
                            <Button onClick={sendMessage} disabled={loading}>
                                Send
                            </Button>
                        </div>
                    </div>
                ) : (
                    // 对话中状态
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === 'USER';
                                let content: ChatParsedContent;
                                try {
                                    content = JSON.parse(msg.content || '{}') as ChatParsedContent;
                                } catch (error) {
                                    console.error('Error parsing message content:', error);
                                    content = { type: "user", message: msg.content || "" };
                                }
                                return (
                                    <>
                                        <div
                                            key={idx}
                                            className={`flex items-start space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-md p-3 rounded-lg text-sm ${isUser ? 'bg-muted text-white' : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {content.type === 'plan' ? (
                                                    <div>
                                                        <strong>Plan:</strong> {content.plan}
                                                        <ul className="mt-2 space-y-1">
                                                            {content.tasks.map((task) => (
                                                                <li key={task.id} className="flex items-center">
                                                                    <span className={`inline-block w-2 h-2 mr-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' : task.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                                                    {task.description} {task.dueDate && `(${new Date(task.dueDate).toLocaleDateString()})`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                ) : (
                                                    <div className="whitespace-pre-wrap text-start">
                                                        {content.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                            {loading && (
                                <div className="flex items-start space-x-2 justify-start">
                                    <div className="max-w-md p-3 rounded-lg text-sm text-gray-800 animate-pulse">
                                        <span className="italic text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full border-t bg-background px-4 py-3 flex gap-2 items-center">
                            <Textarea
                                rows={1}
                                className="flex-1 resize-none rounded-md border border-input bg-background shadow-sm"
                                placeholder="Describe your plan..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        sendMessage()
                                    }
                                }}
                            />
                            <Button onClick={sendMessage} disabled={loading}>
                                Send
                            </Button>
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}
