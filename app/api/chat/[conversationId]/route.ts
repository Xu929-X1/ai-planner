import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
// @eslint-disable-next-line no-unused-vars
export async function GET(req: NextRequest, context: { params: Promise<{ conversationId: string }> }) {
    const params = await context.params;
    const response = await prisma.message.findMany({
        where: {
            conversationId: Number(params.conversationId),
        },
    });

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
}