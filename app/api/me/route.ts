import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserInfo } from "../utils";
export async function GET(request: NextRequest) {
    try {
        const userInfo = await getUserInfo(request);
        if (!userInfo) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { id: userInfo.id as number },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                name: true
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