'use client'
import { Button } from '@/components/UI/button'
import React from 'react'

export default function Dashboard() {
    if (Math.random() > 0.5) {
        throw new Error("Render-time error");
    }
    return (
        <div>
            <Button onClick={() => {
                try {
                    throw new Error("Error");
                } catch (error) {
                    // 在这里处理，比如 showNotification、console.error、跳转 fallback 等
                    console.error("Caught in event handler:", error);
                }
            }}>
                Error Button
            </Button>
        </div>
    )
}
