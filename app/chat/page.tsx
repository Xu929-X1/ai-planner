'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Textarea } from '@/components/UI/textarea'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { endpoints } from '@/app/api/route-helper'

interface ChatMessageUser {
    type: 'user'
    content: string
}
interface ChatMessageAI {
    type: 'ai'
    content: string
}
interface ChatMessageClarification {
    type: 'clarification'
    message: string
}
interface ChatMessagePlan {
    type: 'plan'
    plan: string
    tasks: {
        description: string
        id: string
        status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
        dueDate?: string
    }[]
}
type ChatMessage =
    | ChatMessageUser
    | ChatMessageAI
    | ChatMessageClarification
    | ChatMessagePlan

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
        const newMessages: ChatMessage[] = [...messages, { type: 'user', content: input }]
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
            aiMessage = { type: 'clarification', message: json.data.message }
        } else if (type === 'plan') {
            aiMessage = { type: 'plan', plan: json.data.plan, tasks: json.data.tasks }
        } else {
            aiMessage = { type: 'ai', content: 'Sorry, I could not understand.' }
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
                    // 初始状态：居中显示
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
                            {/* Chat messages 显示区，先用 mock */}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`text-sm px-3 py-2 rounded-md max-w-xl mx-auto whitespace-pre-wrap ${msg.type === 'user' ? 'bg-muted text-right' : 'bg-secondary text-left'
                                        }`}
                                >
                                    {msg.type === 'user' ? msg.content : 'AI: ' + ('message' in msg ? msg.message : 'content' in msg ? msg.content : msg.plan)}
                                </div>
                            ))}
                        </div>

                        {/* 输入框固定底部 */}
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
