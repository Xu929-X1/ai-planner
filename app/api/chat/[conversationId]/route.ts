import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/Errors";
import axios from "axios";
// @eslint-disable-next-line no-unused-vars
export const GET = withApiHandler(async (_req: NextRequest, context: { params: Record<string, string> }) => {

    const conversationId = context.params.conversationId;
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

export const DELETE = withApiHandler(async (_req: NextRequest, context: { params: Record<string, string> }) => {
    try {
        const conversationId = Number(context.params.conversationId);
        await prisma.conversation.delete({
            where: {
                id: conversationId
            }
        })
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw AppError.internal("Internal Server Error", error.cause)
        } else {
            throw AppError.internal("Internal Server Error");
        }
    }
})