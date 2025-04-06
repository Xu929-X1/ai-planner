

interface MyButtonProps extends React.ComponentProps<any> {
    variant?: "default" | "ghost" | "destructive"
    className?: string
}

export const MyButton = ({ variant = "default", className, ...props }: MyButtonProps) => {
    return (
        // <Button
        //     variant={variant}
        //     className={cn("rounded-xl text-sm font-medium", className)}
        //     {...props}
        // />
        <></>
    )
}