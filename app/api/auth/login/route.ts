import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@/app/generated/prisma'
const prisma = new PrismaClient();
export async function POST(req: Request) {
    try {
        const requestBody = await req.json() as {
            body: string
        };
        const { email, password } = JSON.parse(requestBody.body);
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

        // 如果只返回用户基本信息
        return NextResponse.json({ message: 'Login success', userId: user.id, email: user.email })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
}