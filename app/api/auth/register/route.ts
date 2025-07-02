import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        console.log('Received registration request');
        const requestBody = await req.json() as {
            body: string
        };
        const { email, password } = JSON.parse(requestBody.body);
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        if (newuser) {
            console.log('User registered successfully:', newuser.email);
            return new Response(JSON.stringify({ message: 'Registration successful', userId: newuser.id }), { status: 200 });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}