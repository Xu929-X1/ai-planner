interface ChatMessageItemProps {
    message: {
        id: number
        role: 'USER' | 'ASSISTANT'
        content: string
    }
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
    const isPlan = message.content.startsWith('[PLAN]')

    if (isPlan) {
        const content = message.content.replace('[PLAN]', '').trim()
        return (
            <div className="flex justify-start">
                <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-md max-w-xl text-sm whitespace-pre-line">
                    <div className="font-medium mb-1">📋 Plan Proposal</div>
                    {content}
                </div>
            </div>
        )
    }

    if (message.role === 'USER') {
        return (
            <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg max-w-md text-sm whitespace-pre-line">
                    {message.content}
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-lg max-w-md text-sm text-muted-foreground whitespace-pre-line">
                {message.content}
            </div>
        </div>
    )
}
