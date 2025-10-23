import { NextRequest } from "next/server";
import { getUserInfo } from "../utils";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/lib/api/withApiHandlers";

export const GET = withApiHandler(async (req: NextRequest) => {
    const user = await getUserInfo(req);
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const response = await prisma.conversation.findMany({
        where: {
            userId: Number(user?.id),
        },
    });

    return response
});


