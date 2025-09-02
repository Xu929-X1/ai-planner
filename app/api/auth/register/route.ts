import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/api/Errors';
import { withApiHandler } from '@/lib/api/withApiHandlers';
import { NextRequest } from 'next/server';

export const POST = withApiHandler(async (req: NextRequest) => {
    try {
        const requestBody = await req.json();
        const { email, password, name } = (requestBody);
        if (!email || !password) {
            throw AppError.badRequest('Email and password are required');
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw AppError.conflict('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name
            }
        });
        if (newuser) {
            console.log('User registered successfully:', newuser.email);
            return newuser;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        throw AppError.internal('Registration failed');
    }
});


