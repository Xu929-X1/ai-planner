import { ChatParsedContent } from "@/app/chat/page";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function safeParseContent(content: string | undefined | null): ChatParsedContent {
  try {
    if (!content) throw new Error("Empty content");

    const parsed = JSON.parse(content);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error("Not a valid object");
    }

    if (parsed.type === 'plan' || parsed.type === 'clarification') {
      return parsed;
    }

    throw new Error("Unknown structure");
  } catch {
    return { type: 'user', message: content ?? '' };
  }
}