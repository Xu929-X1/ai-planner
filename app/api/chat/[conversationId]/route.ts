import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/Errors";
// @eslint-disable-next-line no-unused-vars
export const GET = withApiHandler(async (_req: NextRequest, context?: { params?: Promise<{ [key: string]: string }> }) => {

    const params = context && context.params ? await context.params : undefined;
    const conversationId = params?.conversationId;
    if (!conversationId) {
        throw AppError.badRequest("conversationId is required");
    }
    const response = await prisma.message.findMany({
        where: {
            conversationId: Number(conversationId),
        },
    });

    return response;
});