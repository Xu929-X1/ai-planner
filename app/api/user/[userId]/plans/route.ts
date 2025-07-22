import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserInfo } from "@/app/api/utils";
//get all tasks and plans under the user
export async function GET(req: NextRequest) {
    try {
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id;
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