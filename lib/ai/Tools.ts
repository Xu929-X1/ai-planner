import axios from "axios";

class Tool {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
};


class TimeTool extends Tool {
    constructor() {
        super("TimeTool", "A tool to get the current time and date.");
    }

    getCurrentTime(): string {
        return new Date().toString();
    }

    calculatgeTimeDifference(date1: Date, date2: Date): number {
        return Math.abs(date1.getTime() - date2.getTime());
    }

    calculateFutureDate(days: number): Date {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        return futureDate;
    }

    calculatePastDate(days: number): Date {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        return pastDate;
    }
}

class WebSearchTool extends Tool {
    constructor() {
        super("WebSearchTool", "A tool to perform web searches.");
    }
    async search(query: string): Promise<string> {
        // Placeholder implementation
        const googleSearchEndpoint = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&q=${encodeURIComponent(query)}`;
        const searchResult = await axios.get(googleSearchEndpoint);
        return await JSON.stringify(searchResult.data);
    }
}

const webSearchTool = new WebSearchTool();
export { webSearchTool };
const timeTool = new TimeTool();
export { timeTool };

export default Tool;