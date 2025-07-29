import { runPlanAgent } from "@/lib/ai/Agents";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getUserInfo } from "../../utils";

export async function POST(req: NextRequest) {
    const request = await req.json();
    const prompt = request.body;
    if (typeof prompt !== 'string') {
        return new Response(
            JSON.stringify({ error: 'Invalid request: prompt must be a string' }),
            { status: 400 }
        );
    }
    const user = await getUserInfo(req);
    const agentResponse = await runPlanAgent(prompt);
    await prisma.conversation.create({
        data: {
            userId: Number(user.id),
            messages: {
                create: [
                    {
                        role: 'USER',
                        content: prompt,
                    },
                    {
                        role: 'ASSISTANT',
                        content: JSON.stringify(agentResponse), // or parsed.message if clarification
                    }
                ]
            }
        }
    })
    return new Response(JSON.stringify({
        message: "Prompt received successfully",
        data: agentResponse,
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
}