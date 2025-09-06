import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/api/Errors';
import { withApiHandler } from '@/lib/api/withApiHandlers';
import { LoginSchema } from '@/lib/api/validators';
import { generateToken } from '@/lib/utils';

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

        const isValid = await bcrypt.compare(password, user.password ?? "")
        if (!isValid) {
            throw AppError.unauthorized('Invalid email or password');
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw AppError.internal('JWT secret is not configured');
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
        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    } catch (error) {
        console.error(error)
        throw AppError.internal('Login failed')
    }
});