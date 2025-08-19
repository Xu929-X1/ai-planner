import prisma from "@/lib/prisma";

//use sessionid as idempotency key
export async function ensureConversation(sessionId: string, userId: number, title = "") {
    let convo = await prisma.conversation.findUnique({
        where: {
            sessionId: sessionId
        }
    });
    if (!convo) {
        convo = await prisma.conversation.create({
            data: {
                sessionId: sessionId,
                userId: userId,
                title: title
            }
        });
    }
    return convo;
}

export async function getConvoContext(sessionId: string, userId: number, title?: string, lastMessageCount = 8) {
    const convo = await ensureConversation(sessionId, userId, title);
    const [messages, plan, task] = await Promise.all([
        prisma.message.findMany({
            where: { conversationId: convo.id },
            orderBy: { createdAt: 'asc' },
            take: lastMessageCount,
        }),
        prisma.plan.findFirst({
            where: { conversationId: convo.id },
            include: { Tasks: true }
        }),
        prisma.task.findMany({
            where: { conversationId: convo.id },
            orderBy: { createdAt: 'asc' }
        })
    ]);
    return { convo, messages, plan, task };
}


export async function persistRun(opts: {
    convId: number; input: string; raw: string; parsedType: "PLAN" | "TASK" | "MESSAGE" | "ERROR";
}) {
    return prisma.agentRun.create({
        data: {
            conversationId: opts.convId, input: opts.input, rawOutput: opts.raw, parsedType: opts.parsedType
        }
    });
}

export async function saveMessages(convId: number, from: "USER" | "ASSISTANT", msg: string) {
    await prisma.message.create({ data: { conversationId: convId, role: from, content: msg } });
}

export async function extractRunsFromConversation(conversationId: number) {
    return prisma.agentRun.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
    });
}