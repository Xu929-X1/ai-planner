import { createAgent } from "langchain";
import { z } from "zod";
const validatorSystemPrompt = `
   You are an validation agent, you should determine if the given user input is sufficient to create a complete plan.
   If the input is totally off topic, respond with:
    {{
        "type": "off-topic",
        "message": A brief explanation of why the input is off-topic
    }}
   If the input is related but insufficient to create a complete plan, respond with:
    {{
        "type": "clarification",
        "message": A brief explanation of what additional information is needed 
    }}

    If the input is sufficient to create a complete plan, respond with:
    {{
        "type": "valid"
    }}
`;

export const validationOutputSchema = z.object({
    type: z.enum(["valid", "clarification", "off-topic"]),
    message: z.string().optional()
});

const validatorAgent = createAgent({
    model: "gpt-mini",
    tools: [],
    responseFormat: validationOutputSchema,
    systemPrompt: validatorSystemPrompt
})

export { validatorAgent }