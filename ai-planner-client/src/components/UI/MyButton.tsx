import { Button } from "./button"
import { cn } from "@lib/utils"

interface MyButtonProps extends React.ComponentProps<any> {
    variant?: "default" | "ghost" | "destructive"
    className?: string
}

export const MyButton = ({ variant = "default", className, ...props }: MyButtonProps) => {
    return (
        <Button
            variant={variant}
            className={cn(className, "bg-blue text-white rounded p-2 ml-2 text-lg")}
            {...props}
        />
    )
}