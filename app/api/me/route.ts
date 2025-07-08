import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
    const token = request.cookies.get('auth_token');
    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
        const payload = await jose.jwtVerify(token.value, secret);
        const user = await prisma.user.findUnique({
            where: { id: payload.payload.id as number },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error verifying token:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}