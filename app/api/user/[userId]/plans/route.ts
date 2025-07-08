import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/prisma";
//get all tasks and plans under the user
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token');
        if (!token) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
        const payload = await jose.jwtVerify(token.value, secret);
        const userId = payload.payload.id;
        if (!userId) {
            return new NextResponse("Unrecognized user", {
                status: 400
            })
        }
        const args = {
            where: {
                userId: Number(userId),
            },
            include: {
                Tasks: true,
            },
        };

        const plans = await prisma.plan.findMany(args);
        return NextResponse.json(plans);
    } catch (error) {
        console.error("❌ JWT verification failed or DB error:", error);
        return new NextResponse("Unauthorized", { status: 401 });
    }
}