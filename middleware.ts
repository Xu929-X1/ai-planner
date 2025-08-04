import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
export async function middleware(request: NextRequest) {
    // so we can skip auth check for these paths

    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret'));
        return NextResponse.next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }

}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/projects/:path*',
        '/tasks/:path*',
        '/plans/:path*',
        '/chat/:path*',
        '/plan/ai/:path*',
    ],

}