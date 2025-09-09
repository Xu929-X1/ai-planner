import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

type AgentRunType = {
    id: string;
    conversationId: number;
    input: string;
    rawOutput: string;
    parsedType: string;
    createdAt: Date;
}

const PlanningSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("clarification"),
        message: z.string()
    }),
    z.object({
        type: z.literal("plan"),
        plan: z.string(),
        tasks: z.array(
            z.object({
                id: z.string(),
                description: z.string(),
                status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
                dueDate: z.string().optional()
            })
        )
    })
]);

const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7
});

const planningSystemPrompt = `
You are an AI agent that helps users plan their tasks and projects.
The current date is ${new Date().toISOString()}.

You will receive a prompt from a user, as well as some context about their previous messages. If no context is provided, meaning it is a new conversation.
Your job is to decide how to respond based on the input:

1. If the input is completely irrelevant to planning (e.g., pure jokes, random statements with no actionable goal or timeline),
   return a clarification message like:
   {{
     "type": "clarification",
     "message": "Please provide more information about your goal, timeframe, or task details." 
    }}
   You may use playful language here.

. If the input has at least a direction (e.g., a goal, activity, or rough idea) but lacks details,
   create a draft plan with placeholders that the user can edit or expand.

   Return the result strictly as a JSON object in the following structure:

   2. If the input has at least a direction (e.g., a goal, activity, or rough idea) but lacks details,
   create a draft plan with placeholders that the user can edit or expand.

   Return the result strictly as a JSON object in the following structure:

   {{
     "type": "plan",
     "plan": "Draft plan based on your input. Some details are missing, please review and edit.",
     "dependencies": [],   // IDs of other plans this plan depends on (can be empty)
    
     "tasks": [
       {{
         "id": "t1",
         "description": "Define timeline for <project>",
         "status": "PENDING",
         "dueDate": "2025-09-07T12:00:00.000Z",   // valid ISO 8601 string
         "priority": 1,
         "dependencies": [],   // task-level dependencies (IDs of other tasks)
         "dependents": [] //task-level dependencies
       }},
       {{
         "id": "t2",
         "description": "Identify resources needed for <project>",
         "status": "PENDING",
         "dueDate": "2025-09-08T12:00:00.000Z",
         "priority": 1,
         "dependencies": [],
         "dependents": []
        }}
     ]
    }}

   Notes:
   - "dueDate" must be a valid ISO 8601 string (estimate a realistic date based on the task).
   - Always include "planDependency" at the top level and "dependencies" for each task (arrays, can be empty).
   - Replace <project> with the actual project or goal mentioned by the user.
   - Keep the output strictly in JSON format without additional text.


   Notes:
   - "dueDate" must be a valid ISO 8601 string (estimate a realistic date based on the task).
   - Always include "dependencies" and "dependents" as an array (can be empty if none).
   - Replace <project> with the actual project or goal mentioned by the user.
3. If the input already has enough details, 
   generate a structured plan directly without placeholders.

Rules:
- Only return one of the above formats.
- Do not include explanations or extra text outside the JSON.
- Output language should match the user's input language.
- Be friendly and engaging, but always stick strictly to JSON format.
- Do not wrap the JSON in markdown or code blocks
`;


const planPrompt = ChatPromptTemplate.fromMessages([
    ["system", planningSystemPrompt],
    ["human", "{input}\n\nContext:\n{context}"]
]);

const planChain = RunnableSequence.from([
    planPrompt,
    model,
    new StringOutputParser()
]);

const summaryPrompt = `You are a summary agent, 
    you will be given a series of messages and you will give a brief summary of the conversation, 
    the summary will be used to help other agents understand the context of the conversation.
    the summary should be concise and to the point, without any fluff or unnecessary details.
    The length of the summary should be no more than 3 sentences.
    `

const summaryChain = RunnableSequence.from([
    ChatPromptTemplate.fromMessages([
        ["system", summaryPrompt],
        ["human", "{input}"]
    ]),
    model,
    new StringOutputParser()
]);

export async function runPlanAgent(userInput: string, context: string) {
    const raw = await planChain.invoke({ input: userInput, context });

    try {
        const json = JSON.parse(raw);
        const parsed = PlanningSchema.parse(json);
        return parsed;
    } catch (err) {
        console.error("Error parsing response:", err);
        return {
            type: "clarification",
            message: `⚠️ Invalid response format:\n\n${raw}`
        };
    }
}

export async function runSummaryAgent(userInput: string, context: string) {
    return await summaryChain.invoke({ input: context });
}

export async function runPlannerWithAutoSummary(userInput: string, rawContext: AgentRunType[]) {
    const context = rawContext.map(run => `${run.input} - ${run.rawOutput}`).join("\n");
    const summary = await runSummaryAgent(userInput, context);
    console.log("Auto-generated summary:", summary);
    const agentResponse = await runPlanAgent(userInput, summary);
    return agentResponse;
}

