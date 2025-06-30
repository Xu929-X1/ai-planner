import "@/app/globals.css";
export const metadata = {
    title: {
        template: '%s | AI Planner',
        default: 'AI Planner',
    },
    description: 'AI Planner - Your personal AI assistant for planning and productivity',
    keywords: 'AI, Planner, Productivity, Task Management, Personal Assistant',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang={typeof navigator !== "undefined" ? navigator.language.split('-')[0] : "en"}>
            <body>
                {children}
            </body>
        </html>
    )
}