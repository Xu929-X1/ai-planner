import { NextRequest } from "next/server";
import { getUserInfo } from "../utils";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const user = await getUserInfo(req);

    const response = await prisma.conversation.findMany({
        where: {
            userId: Number(user.id),
        },
    });

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
}