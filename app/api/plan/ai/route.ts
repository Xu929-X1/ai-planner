import { runPlanAgent } from "@/lib/ai/Agents";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const request = await req.json();
    const prompt = request.body;
    if (typeof prompt !== 'string') {
        return new Response(
            JSON.stringify({ error: 'Invalid request: prompt must be a string' }),
            { status: 400 }
        );
    }

    const agentResponse = await runPlanAgent(prompt);
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