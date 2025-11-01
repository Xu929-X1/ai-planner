import { OpenAI } from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateTitleFromMessage(userInput: string): Promise<string> {
    const prompt = `You are a title generation assistant. Based on the user's input, generate a concise and clear title for their plan or discussion.
                    User input: "${userInput}".
                    Do not include any explanations or additional text, just return the title. The length of the title should be between 5 to 10 words. Make it engaging and relevant to the content of the input.
                    `

    const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that generates concise and relevant titles from user input.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.4,
        max_tokens: 30
    })

    const title = res.choices[0]?.message?.content?.trim()

    return title || 'New Plan Discussion'
}