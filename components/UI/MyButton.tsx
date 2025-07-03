import { Button } from "./button"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "destructive"
    className?: string
}

export const MyButton = ({ variant = "default", className, ...props }: MyButtonProps) => {
    return (
        <Button
            variant={variant}
            className={cn(className, className = "text-white rounded hover:bg-blue-600 transition duration-200 hover:cursor-pointer")}
            {...props}
        />
    )
}