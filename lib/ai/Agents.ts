// import { createAgent } from "langchain";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { RunnableSequence } from "@langchain/core/runnables";
// import { StringOutputParser } from "@langchain/core/output_parsers";

// type AgentRunType = {
//     id: string;
//     conversationId: number;
//     input: string;
//     rawOutput: string;
//     parsedType: string;
//     createdAt: Date;
// }

// const model = createAgent({
//     model: "gpt-4o",
// });



// const planPrompt = ChatPromptTemplate.fromMessages([
//     ["system", planningSystemPrompt],
//     ["human", "{input}\n\nContext:\n{context}"]
// ]);

// const planChain = RunnableSequence.from([
//     planPrompt,
//     model,
//     new StringOutputParser()
// ]);

// const summaryPrompt = `You are a summary agent, 
//     you will be given a series of messages and you will give a brief summary of the conversation, 
//     the summary will be used to help other agents understand the context of the conversation.
//     the summary should be concise and to the point, without any fluff or unnecessary details.
//     The length of the summary should be no more than 3 sentences.
//     `

// const summaryChain = RunnableSequence.from([
//     ChatPromptTemplate.fromMessages([
//         ["system", summaryPrompt],
//         ["human", "{input}"]
//     ]),
//     model,
//     new StringOutputParser()
// ]);

// export async function runPlanAgent(userInput: string, context: string) {
//     const raw = await planChain.invoke({ input: userInput, context });

//     try {
//         const json = JSON.parse(raw);
//         const parsed = PlanningSchema.parse(json);
//         return parsed;
//     } catch (err) {
//         console.error("Error parsing response:", err);
//         return {
//             type: "clarification",
//             message: `⚠️ Invalid response format:\n\n${raw}`
//         };
//     }
// }

// export async function runSummaryAgent(userInput: string, context: string) {
//     return await summaryChain.invoke({ input: context });
// }

// export async function runPlannerWithAutoSummary(userInput: string, rawContext: AgentRunType[]) {
//     const context = rawContext.map(run => `${run.input} - ${run.rawOutput}`).join("\n");
//     const summary = await runSummaryAgent(userInput, context);
//     console.log("Auto-generated summary:", summary);
//     const agentResponse = await runPlanAgent(userInput, summary);
//     return agentResponse;
// }

