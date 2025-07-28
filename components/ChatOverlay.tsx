// components/ChatOverlay.tsx
'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/UI/dialog'
import { Button } from '@/components/UI/button'
import { Textarea } from '@/components/UI/textarea'
import { Sparkles } from 'lucide-react'
import { endpoints } from '@/app/api/route-helper'
import axios from 'axios'
import { DialogTitle } from '@radix-ui/react-dialog'

interface ChatMessageUser {
    type: 'user';
    content: string;
}
interface ChatMessageAI {
    type: 'ai';
    content: string;
}
interface ChatMessageClarification {
    type: 'clarification';
    message: string;
}
interface ChatMessagePlan {
    type: 'plan';
    plan: string;
    tasks: {
        description: string;
        id: string;
        status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
        dueDate?: string;
    }[];
}

type ChatMessage =
    | ChatMessageUser
    | ChatMessageAI
    | ChatMessageClarification
    | ChatMessagePlan

export function ChatOverlay({ open, onClose }: { open: boolean, onClose: () => void, userInput?: string }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMessages: ChatMessage[] = [...messages, { type: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        const res = await axios.post(endpoints.plan.aiGenerate.post, {
            body: input
        })
        const json = await res.data;
        const { type } = json.data;

        let aiMessage: ChatMessage;
        if (type === 'clarification') {
            aiMessage = { type: 'clarification', message: json.data.message };
        } else if (type === 'plan') {
            aiMessage = { type: 'plan', plan: json.data.plan, tasks: json.data.tasks };
        } else {
            aiMessage = { type: 'ai', content: 'Sorry, I could not understand.' };
        }

        setMessages((prev) => [...prev, aiMessage]);
        setLoading(false);
        console.log("AI Response:", aiMessage);
    }

    const renderMessage = (msg: ChatMessage, idx: number) => {
        if (msg.type === 'user') return <div key={idx} className="text-right"><span className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded-xl mb-2">{msg.content}</span></div>
        if (msg.type === 'ai') return <div key={idx} className="text-left"><span className="inline-block bg-muted px-3 py-2 rounded-xl mb-2">{msg.content}</span></div>
        if (msg.type === 'clarification') return <div key={idx} className="text-left"><div className="bg-muted text-accent-foreground px-3 py-2 rounded-xl mb-2">{msg.message}</div></div>
        if (msg.type === 'plan') return (
            <div key={idx} className="text-left space-y-2 px-4 py-3 rounded-xl border-muted border-2">
                <div className="font-medium text-lg flex items-center gap-1"><Sparkles size={16} />Plan</div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{msg.plan}</p>
                <div className="mt-2 space-y-1">
                    {msg.tasks.map((t, i) => (
                        <div key={i} className="text-sm bg-background px-3 py-1 border rounded-md">
                            {t.description}
                        </div>
                    ))}
                </div>
                <Button className="mt-3">Confirm & Save</Button>
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                AI Planner
            </DialogTitle>
            <DialogContent className="w-full max-w-2xl h-[80vh] flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-2 mt-5">
                    {messages.map((msg, idx) => renderMessage(msg, idx))}
                    {loading && <div className="text-left text-sm text-muted-foreground animate-pulse">Typing...</div>}
                </div>
                <div className="border-t border-border p-3 flex gap-2">
                    <Textarea
                        rows={1}
                        className="flex-1 resize-none"
                        placeholder="Describe what you want to plan..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    />
                    <Button disabled={loading} onClick={sendMessage}>Send</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
