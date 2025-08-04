'use client';
import { Textarea } from '@/components/UI/textarea'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { endpoints } from '../api/route-helper';
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

interface Conversation {
    archived: boolean;
    createdAt: string;
    id: number;
    title: string;
    updatedAt: string;
    userId: number;

}

type ChatMessage =
    | ChatMessageUser
    | ChatMessageAI
    | ChatMessageClarification
    | ChatMessagePlan
export default function Page() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [allConversations, setAllConversations] = useState<Conversation[]>([]);
    async function getAllConversations() {
        const res = await axios.get<Conversation[]>(endpoints.chat.allChat.get);
        const json = await res.data;
        setAllConversations(json);
    }

    useEffect(() => {
        getAllConversations();
    }, []);

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
    }
    return (
        <div className='flex flex-row h-screen w-screen'>
            {/* Sidebar */}
            <div className='flex-1 bg-background border-r border-muted flex  justify-center overflow-y-auto'>
                <div className='text-muted-foreground pt-4 px-4'>
                    <ul className='space-y-2'>
                        {allConversations.map((conversation: Conversation, index: number) => (
                            <li key={index} className='p-2 hover:bg-muted rounded cursor-pointer'>
                                {conversation.title || `Conversation ${index + 1}`}
                            </li>
                        ))}
                    </ul>
                </div>


            </div>

            {/* Main Content */}
            <div className='flex-9 items-center justify-center overflow-auto'>
                <h1>
                    What do you want to plan today?
                </h1>
                <Textarea
                    rows={1}
                    className="flex-1 resize-none"
                    placeholder="Describe what you want to plan..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                />
            </div>
        </div>
    )
}