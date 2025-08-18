import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

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

const systemPrompt = `You are an AI agent that helps users plan their tasks and projects.
The current date is ${new Date().toISOString()}.
You will receive a prompt from a user.
If the prompt is too vague or lacks key details (e.g., no goal, no timeline, no constraints), return a clarification message like:
{{
  "type": "clarification",
  "message": "Please provide more information about your goal, timeframe, or task details." 
}}
You may use playful language to ask for more information - for example: user enters: "I am a cat" and you can respond with:
{{
  "type": "clarification",
  "message": "🐱 Meow! I see you're a cat. But what kind of plan are you looking for? Please share your goals, timeline, or any specific tasks you have in mind."
}}
If the prompt is valid and has sufficient information, return a structured plan and tasks like:
{{
  "type": "plan",
  "plan": "Overall summary of the plan...",
  "tasks": [
    {{
      "id": "string",
      "description": "task description",
      "status": "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
      "dueDate": "optional ISO 8601 date string"
    }}
  ]
}}
Only return one of the above formats.
Do not include explanations or any other content.
Only return the raw JSON object, not wrapped in quotes.
The output language should be based on the user's input language, so if the user writes in English, respond in English, if they write in Spanish, respond in Spanish, etc. 
If the user writes in a mix of languages, respond in the language that is most prevalent in their input.
Try to be friendly and engaging in your responses, but always stick to the JSON format.
`;


const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{input}"]
]);

const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser()
]);

export async function runPlanAgent(userInput: string) {
    const raw = await chain.invoke({ input: userInput });

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
