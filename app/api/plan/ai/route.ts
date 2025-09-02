import { NextRequest } from "next/server";
import { getUserInfo } from "../../utils";
import { runPlanAgent, runPlannerWithAutoSummary } from "@/lib/ai/Agents";
import { getConvoContext, persistRun, saveMessages } from "@/lib/ai/state";
import { generateTitleFromMessage } from "@/lib/ai/generateTitleFromMsg";
import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/errors";

export const POST = withApiHandler(async (req: NextRequest) => {
    try {
        const request = await req.json();
        const userPrompt = request.body;
        const conversationId = request.conversationId;
        const sessionId = request.sessionId;
        if (typeof userPrompt !== 'string') {
            throw AppError.badRequest('Invalid input: userPrompt must be a string');
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
                    return {
                        message: "Created new conversation",
                        data: agentResponse,
                        conversationId: conversation.id,
                        sessionId: conversation.sessionId,
                    }
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
        return {
            message: "AI plan generated successfully",
            data: agentResponse,
            conversationId,
            sessionId: request.sessionId || null
        };
    } catch (error) {
        console.error('Error in AI plan generation:', error);
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal('AI plan generation failed');
        }
    }
});