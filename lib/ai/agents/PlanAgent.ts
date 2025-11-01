import { createAgent, summarizationMiddleware, tool } from "langchain";
import z from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { validationOutputSchema } from "./Validator";

const planningSystemPrompt = `
You are an AI agent that helps users plan their tasks and projects.
The current date is ${new Date().toISOString()}.

You will receive a prompt from a user, as well as some context about their previous messages.
If no context is provided, meaning it is a new conversation, decide how to respond:

1. If the input is completely irrelevant to planning (e.g., jokes, random statements with no actionable goal or timeline),
   return a clarification message in this exact JSON format:
   {{
     "type": "clarification",
     "message": "Please provide more information about your goal, timeframe, or task details."
   }}

2. If the input has at least a direction (e.g., a goal, activity, or rough idea) but lacks details,
   create a draft plan with placeholders that the user can edit or expand.
   Return strictly in this JSON structure:
   {{
     "type": "plan",
     "plan": "Draft plan based on your input. Some details are missing, please review and edit.",
     "planDependencies": [],   // IDs of other plans this plan depends on (can be empty)
     "tasks": [
       {{
         "id": "t1",
         "description": "Define timeline for <project>",
         "status": "PENDING",
         "dueDate": "2025-09-07T12:00:00.000Z",   // valid ISO 8601 string
         "priority": 1,
         "dependencies": [],   // task-level dependencies (IDs of other tasks)
         "dependents": []      // task-level dependents (IDs of tasks that depend on this task)
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

3. If the input already has enough details, 
   generate a structured plan directly without placeholders, using the same JSON format as in case (2).

Rules:
- Only return one of the above formats.
- Do not include explanations or extra text outside the JSON.
- Output language must match the user's input language.
- Every plan MUST include "planDependencies".
- Every task MUST include both "dependencies" and "dependents" arrays (can be empty).
- If there are 2 or more tasks, infer at least one dependency edge:
  - Use ordering and semantics when possible (e.g., research → design → implement → test).
  - If nothing explicit, default to a linear chain: each task depends on the previous one.
- Task IDs must be unique and dependencies must reference existing IDs.
- "dueDate" must be a valid ISO 8601 string and cannot be earlier than any dependency's dueDate.
- Return only JSON, never wrap in markdown/code fences.
`;

const PlanningSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("clarification"),
    message: z.string()
  }),
  z.object({
    type: z.literal("plan"),
    plan: z.string(),
    dependencies: z.array(z.string()).default([]),
    tasks: z.array(
      z.object({
        id: z.string(),
        description: z.string(),
        status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
        dueDate: z.string().optional(),
        taskDependencies: z.array(z.string()).default([]),
        taskDependents: z.array(z.string()).default([])
      })
    )
  })
]);

const PlanAgent = createAgent({
  model: "gpt-5",
  middleware: [
    summarizationMiddleware({
      model: new ChatOpenAI({ model: "gpt-4o" }),
      maxTokensBeforeSummary: 1000
    })
  ],
  systemPrompt: planningSystemPrompt,
  responseFormat: PlanningSchema
});

const callPlanAgent = tool(
  async (query) => {
    if (query.type === "valid" && typeof query.message === "string") {
      const response = await PlanAgent.invoke({
        messages: [{ role: "user", content: query.message }]
      });
      return response.messages.at(-1)?.text;
    }
    return undefined;
  },
  {
    name: "Plan Agent",
    description: "Generates structured plans and tasks based on user input.",
    schema: validationOutputSchema
  }
);

export { PlanAgent, PlanningSchema, callPlanAgent };