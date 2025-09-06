import { ChatParsedContent } from "@/app/chat/page";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as jose from 'jose';

export type UserPayload = {
  id: number;
  email: string;
}
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

export async function sha256(buf: BufferSource) {
  return crypto.subtle.digest('SHA-256', buf);
}

export function base64url(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function randomString(len = 64) {
  const arr = new Uint8Array(len); crypto.getRandomValues(arr);
  return Array.from(arr, x => ('0' + x.toString(16)).slice(-2)).join('');
}

export async function generateToken(payload: UserPayload, secret: string) {
  const encoder = new TextEncoder();
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encoder.encode(secret));

  return jwt;
}