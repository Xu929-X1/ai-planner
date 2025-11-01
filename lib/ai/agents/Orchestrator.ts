import { createAgent } from "langchain";

const orchestrator = createAgent({
    model: "gpt-5",
    tools: [],
});

export { orchestrator };