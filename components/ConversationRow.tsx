import React, { memo, SetStateAction } from 'react'
import { ConversationActions } from './ConversationActions';
import { Conversation } from '@/app/chat/page';

export const ConversationRow = memo(function ConversationRow({
    conv, active, onSelect, onArchive, onDelete,
}: {
    conv: Conversation; active: boolean;
    onSelect: React.Dispatch<SetStateAction<Conversation | null>>; onArchive: (id: number) => void; onDelete: (id: number) => void;
}) {
    return (
        <div
            onClick={() => onSelect(conv)}
            className={`group flex items-center justify-between rounded p-2 text-sm cursor-pointer ${active ? "bg-muted" : "hover:bg-muted"
                }`}
        >
            <span className="truncate">{conv.title}</span>
            <ConversationActions convId={conv.id} onArchive={onArchive} onDelete={onDelete} />
        </div>
    );
});