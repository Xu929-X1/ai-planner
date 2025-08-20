import { runPlanAgent } from "@/lib/ai/Agents"
import { generateTitleFromMessage } from "@/lib/ai/generateTitleFromMsg"
import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"
import { getUserInfo } from "../../utils"
import { Prisma } from "@/app/generated/prisma"

export async function POST(req: NextRequest) {
    try {
        const request = await req.json()
        const prompt = request.body
        const conversationId = request.conversationId
        if (typeof prompt !== "string") {
            return new Response(
                JSON.stringify({ error: "Invalid request: prompt must be a string" }),
                { status: 400 }
            )
        }

        const user = await getUserInfo(req)
        const agentResponse = await runPlanAgent(prompt)
        if (conversationId) {
            const conversation = await prisma.conversation.update({
                where: { id: Number(conversationId) },
                data: {
                    messages: {
                        create: [
                            {
                                role: "USER",
                                content: prompt
                            },
                            {
                                role: "ASSISTANT",
                                content: JSON.stringify(agentResponse)
                            }
                        ]
                    }
                }
            })
            return Response.json(
                {
                    message: "Appended to existing conversation",
                    data: agentResponse,
                    conversationId: conversation.id,
                },
                { status: 200 }
            );
        } else {
            const title = await generateTitleFromMessage(prompt);
            for (let attempt = 0; attempt < 3; attempt++) {
                const sessionId = crypto.randomUUID();
                try {
                    const conversation = await prisma.conversation.create({
                        data: {
                            userId: Number(user.id),
                            title,
                            sessionId,
                            messages: {
                                create: [
                                    { role: "USER", content: prompt },
                                    { role: "ASSISTANT", content: JSON.stringify(agentResponse) }
                                ]
                            }
                        }
                    });
                    return Response.json(
                        {
                            message: "Created new conversation",
                            data: agentResponse,
                            conversationId: conversation.id,
                            sessionId: conversation.sessionId,
                        },
                        { status: 201 }
                    );
                } catch (e: unknown) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {
                        if (e.code === "P2002") {// p2002 is unique constraint violation
                            continue;
                        }
                    } else {
                        throw e;
                    }
                }
            }
            throw new Error("Failed to allocate unique sessionId after 3 attempts.");
        }

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return Response.json({ error: message }, { status: 500 });
    }
}
