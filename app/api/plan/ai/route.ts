import { NextRequest, NextResponse } from "next/server";
import { getUserInfo } from "../../utils";
import { runPlanAgent, runPlannerWithAutoSummary } from "@/lib/ai/Agents";
import { getConvoContext, persistRun, saveMessages } from "@/lib/ai/state";
import { generateTitleFromMessage } from "@/lib/ai/generateTitleFromMsg";
import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const request = await req.json();
        const userPrompt = request.body;
        const conversationId = request.conversationId;
        const sessionId = request.sessionId;
        if (typeof userPrompt !== 'string') {
            return new Response('Invalid input', { status: 400 });
        }
        const user = await getUserInfo(req);
        let agentResponse;
        if (sessionId) {
            const convoContext = await getConvoContext(sessionId, Number(user.id));
            const agentRunArray = convoContext.agentRuns;
            agentResponse = await runPlannerWithAutoSummary(userPrompt, agentRunArray);
        } else {
            const title = await generateTitleFromMessage(userPrompt);
            //skip the summary step, no sessionId means no previous context
            agentResponse = await runPlanAgent(userPrompt, "");
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
                                    { role: "USER", content: userPrompt },
                                    { role: "ASSISTANT", content: JSON.stringify(agentResponse) }
                                ]
                            }
                        }
                    });
                    return NextResponse.json(
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
        }
        saveMessages(conversationId, "USER", userPrompt);
        saveMessages(conversationId, "ASSISTANT", typeof agentResponse === "string" ? agentResponse : JSON.stringify(agentResponse));
        persistRun(
            {
                convId: conversationId,
                input: userPrompt,
                raw: typeof agentResponse === "string" ? agentResponse : JSON.stringify(agentResponse),
                parsedType: agentResponse.type === "clarification" ? "MESSAGE" : agentResponse.type === "plan" ? "PLAN" : "ERROR"
            }
        )
        return NextResponse.json(
            {
                message: "AI plan generated successfully",
                data: agentResponse,
                conversationId,
                sessionId: request.sessionId || null
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in AI plan generation:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}