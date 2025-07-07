"use client";

import React from "react";
import { Button } from "./UI/button";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};
function BackButton() {
    return (
        <Button
            onClick={() => {
                window.location.href = "/"
            }}
        >
            Back to Home
        </Button>
    );
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("❌ Caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen text-center p-4 gap-4">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
                        <p className="text-gray-500">Please try refreshing the page or contact support.</p>
                    </div>
                    <BackButton />
                </div>
            );
        }
        return this.props.children;
    }
}
