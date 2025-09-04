import "@/app/globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
// import NavBar from "@/components/nav/NavBar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import UserProvider from "@/contexts/userContext";
import React from "react";

export const metadata = {
    title: {
        template: '%s | AI Planner',
        default: 'AI Planner',
    },
    description: 'AI Planner - Your personal AI assistant for planning and productivity',
    keywords: 'AI, Planner, Productivity, Task Management, Personal Assistant',

}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang={typeof navigator !== "undefined" ? navigator.language.split('-')[0] : "en"} >
            <head>
                <meta name="google-signin-client_id" content="183173323283-t9c3b0p4bqqqvdlh1dal614nb1su31or.apps.googleusercontent.com.apps.googleusercontent.com"/>
            </head>

            <body>
                <script src="https://apis.google.com/js/platform.js" async defer></script>
                <ErrorBoundary>
                    <NotificationProvider>
                        <UserProvider>
                            {/* <header>
                                <NavBar />
                            </header> */}
                            <main className="flex flex-col items-center justify-center p-4 text-center w-full h-screen overflow-x-hidden">
                                {
                                    children
                                }
                            </main>
                            <footer className="py-4">
                                <div className="container mx-auto text-center">
                                    <p>&copy; {new Date().getFullYear()} AI Planner. All rights reserved.</p>
                                </div>
                            </footer>
                        </UserProvider>
                    </NotificationProvider>
                </ErrorBoundary>
            </body>
        </html>
    )
}