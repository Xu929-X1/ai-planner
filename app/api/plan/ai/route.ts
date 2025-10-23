import { NextRequest } from "next/server";
import { getUserInfo } from "../../utils";
import { runPlanAgent, runPlannerWithAutoSummary } from "@/lib/ai/Agents";
import { getConvoContext, persistRun, saveMessages } from "@/lib/ai/state";
import { generateTitleFromMessage } from "@/lib/ai/generateTitleFromMsg";
import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/Errors";

type AgentResponse =
    | string
    | {
        type?: "clarification" | "plan" | string;
        [k: string]: unknown;
    };

const toRaw = (resp: AgentResponse) =>
    typeof resp === "string" ? resp : JSON.stringify(resp);

const getParsedType = (resp: AgentResponse) => {
    if (typeof resp === "string") return "MESSAGE";
    if (resp?.type === "clarification") return "MESSAGE";
    if (resp?.type === "plan") return "PLAN";
    return "ERROR";
};

async function logRun(conversationId: number, userPrompt: string, resp: AgentResponse) {
    await persistRun({
        convId: conversationId,
        input: userPrompt,
        raw: toRaw(resp),
        parsedType: getParsedType(resp),
    });
}

async function appendTurn(conversationId: number, userPrompt: string, resp: AgentResponse) {
    await Promise.all([
        saveMessages(conversationId, "USER", userPrompt),
        saveMessages(conversationId, "ASSISTANT", toRaw(resp)),
    ]);
    await logRun(conversationId, userPrompt, resp);
}

async function createConversationWithRetry(params: {
    userId: number;
    title: string;
    userPrompt: string;
    resp: AgentResponse;
    maxAttempts?: number;
}) {
    const { userId, title, userPrompt, resp, maxAttempts = 3 } = params;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const newSessionId = crypto.randomUUID();

        try {
            const conversation = await prisma.conversation.create({
                data: {
                    userId,
                    title,
                    sessionId: newSessionId,
                    messages: {
                        create: [
                            { role: "USER", content: userPrompt },
                            { role: "ASSISTANT", content: toRaw(resp) },
                        ],
                    },
                },
            });

            await logRun(conversation.id, userPrompt, resp);
            return conversation;
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                continue;
            }
            throw e;
        }
    }

    throw new Error("Failed to create conversation after retries (P2002).");
}
export const POST = withApiHandler(async (req: NextRequest) => {
    try {
        const payload = await req.json();
        const userPrompt: unknown = payload.body;
        const conversationId: number | undefined = payload.conversationId;
        const incomingSessionId: string | undefined = payload.sessionId;

        if (typeof userPrompt !== "string") {
            throw AppError.badRequest("Invalid input: userPrompt must be a string");
        }

        const user = await getUserInfo(req);
        const userId = Number(user.id);

        let agentResponse: AgentResponse;

        if (incomingSessionId) {
            const convoContext = await getConvoContext(incomingSessionId, userId);
            const agentRunArray = convoContext.agentRuns;
            console.log("Agent Runs:", agentRunArray);

            agentResponse = await runPlannerWithAutoSummary(userPrompt, agentRunArray);

            if (typeof conversationId !== "number") {
                throw AppError.badRequest("conversationId is required when sessionId is provided");
            }

            await appendTurn(conversationId, userPrompt, agentResponse);

            return {
                message: "AI plan generated successfully",
                data: agentResponse,
                conversationId,
                sessionId: incomingSessionId,
            };
        }

        const title = await generateTitleFromMessage(userPrompt);
        agentResponse = await runPlanAgent(userPrompt, "");

        const conversation = await createConversationWithRetry({
            userId,
            title,
            userPrompt,
            resp: agentResponse,
        });

        return {
            message: "Created new conversation",
            data: agentResponse,
            conversationId: conversation.id,
            sessionId: conversation.sessionId,
        };
    } catch (error) {
        console.error("Error in AI plan generation:", error);
        if (error instanceof AppError) {
            throw error;
        }
        throw AppError.internal("AI plan generation failed");
    }
});