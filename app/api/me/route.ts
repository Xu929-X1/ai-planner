import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserInfo } from "../utils";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/Errors";

export const GET = withApiHandler(async (request: NextRequest) => {
    try {
        const userInfo = await getUserInfo(request);
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
            throw AppError.notFound('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw AppError.unauthorized('Invalid or expired token');
    }
});