// ConversationActions.tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/UI/dropdown-menu";
import { MoreHorizontal, Trash2, Archive } from "lucide-react";

export function ConversationActions({
    onArchive, onDelete, convId,
}: { convId: number; onArchive: (id: number) => void; onDelete: (id: number) => void; }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
                aria-label="Conversation actions"
            >
                <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => onArchive(convId)}>
                    <Archive className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(convId)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}