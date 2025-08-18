import { runPlanAgent } from "@/lib/ai/Agents"
import { generateTitleFromMessage } from "@/lib/ai/generateTitleFromMsg"
import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"
import { getUserInfo } from "../../utils"
import { Prisma } from "@/app/generated/prisma"

export async function POST(req: NextRequest) {
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

    let conversation

    if (conversationId) {
        conversation = await prisma.conversation.update({
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
    } else {
        const title = await generateTitleFromMessage(prompt); // 或者先用占位符，异步更新标题

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
                return conversation;
            } catch (e: unknown) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === "P2002") {
                        continue;
                    }
                } else {
                    throw e; // 其他错误继续抛
                }
            }
        }
        throw new Error("Failed to allocate unique sessionId after 3 attempts.");
    }

    return new Response(
        JSON.stringify({
            message: "Prompt received successfully",
            data: agentResponse,
            conversationId: conversation.id
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
}
