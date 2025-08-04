import { runPlanAgent } from "@/lib/ai/Agents"
import { generateTitleFromMessage } from "@/lib/ai/generateTitleFromMsg"
import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"
import { getUserInfo } from "../../utils"

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
        const title = await generateTitleFromMessage(prompt)
        conversation = await prisma.conversation.create({
            data: {
                userId: Number(user.id),
                title,
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
