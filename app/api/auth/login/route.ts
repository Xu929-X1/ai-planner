import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers';
import * as jose from 'jose';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/api/Errors';
import { withApiHandler } from '@/lib/api/withApiHandlers';
import { LoginSchema } from '@/lib/api/validators';

type UserPayload = {
    id: number;
    email: string;
}

async function generateToken(payload: UserPayload, secret: string) {
    const encoder = new TextEncoder();
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(encoder.encode(secret));

    return jwt;
}

export const POST = withApiHandler(async (req: NextRequest) => {
    try {
        const json = await req.json().catch(() => {
            throw AppError.badRequest('Invalid JSON body', 400);
        });
        const parsed = await LoginSchema.safeParseAsync(json);
        if (!parsed.success) {
            throw AppError.badRequest('Invalid request body', 400);
        }
        const { email, password } = parsed.data;

        if (!email || !password) {
            throw AppError.badRequest('Email and password are required', 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw AppError.notFound();
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: 'Incorrect password or username' }, { status: 401 })
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT secret is not set');
        }
        const token = await generateToken({ id: user.id, email: user.email }, JWT_SECRET);
        (await cookies()).set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
            maxAge: 2 * 60 * 60, // 2 hours
        })
        return NextResponse.json({ message: 'Login success', userId: user.id, email: user.email }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
});