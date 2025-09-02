import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserInfo } from "@/app/api/utils";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/errors";
//get all tasks and plans under the user

export const GET = withApiHandler(async (req: NextRequest) => {
    try {
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id;
        if (!userId) {

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
        return plans;
    } catch (error) {
        console.error("JWT verification failed or DB error:", error);
        throw AppError.unauthorized("Invalid or expired token");
    }
})