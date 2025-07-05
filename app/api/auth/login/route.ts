import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers';
import * as jose from 'jose';
import prisma from '@/lib/prisma';

type UserPayload = {
    id: number;
    email: string;
}

async function generateToken(payload: UserPayload, secret: string) {
    const encoder = new TextEncoder();
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h') // Token valid for 2 hours
        .sign(encoder.encode(secret));

    return jwt;
}


export async function POST(req: Request) {
    try {
        const { email, password }= await req.json();
       
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 404 })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: 'Incorrect password or username' }, { status: 401 })
        }
        const token = await generateToken({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_secret');
        (await cookies()).set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
            maxAge: 2 * 60 * 60, // 2 hours
        })
        // 如果只返回用户基本信息
        return NextResponse.json({ message: 'Login success', userId: user.id, email: user.email }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
}