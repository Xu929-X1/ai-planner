import { tool } from "langchain"
import z from "zod";

const timeToolCallingSchema = z.object({
    action: z.enum(["getCurrentTime", "convertTime", "calculateDifference"]),
    baseTime: z.string().optional(),
    targetTime: z.string().optional(),
    targetLocation: z.string().optional()
})

const TimeTool = tool(
    async ({ action, baseTime, targetTime, targetLocation }: {
        action: "getCurrentTime" | "convertTime" | "calculateDifference",
        baseTime?: string,
        targetTime?: string,
        targetLocation?: string
    }) => {
        if (action === "getCurrentTime") {
            return new Date().toISOString();
        } else if (action === "convertTime" && baseTime && targetTime) {
            const date = new Date(baseTime);
            return date.toLocaleString(targetLocation, { timeZone: targetTime });
        } else if (action === "calculateDifference" && baseTime && targetTime) {
            const date1 = new Date(baseTime);
            const date2 = new Date(targetTime);
            const diffMs = Math.abs(date2.getTime() - date1.getTime());
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `${diffHours} hours and ${diffMinutes} minutes`;
        }
    },
    {
        name: "TimeAgent",
        description: "Useful for when you need to answer questions about the current date and time.",
        schema: timeToolCallingSchema
    },
)

export { TimeTool }