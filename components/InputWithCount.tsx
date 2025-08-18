import { Input as ShadcnInput } from "@/components/UI/input";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type InputWithCountProps = React.ComponentProps<typeof ShadcnInput> & {
    maxLength: number;
};

export const InputWithCount = React.forwardRef<HTMLInputElement, InputWithCountProps>(
    ({ maxLength, className, ...props }, ref) => {
        const [value, setValue] = useState(props.value ?? "");

        return (
            <div className="w-full">
                <ShadcnInput
                    ref={ref}
                    {...props}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        props.onChange?.(e);
                    }}
                    maxLength={maxLength}
                    className={cn(className)}
                />
                <p className="text-gray-500 text-xs mt-1 text-right">
                    {String(value).length}/{maxLength} characters
                </p>
            </div>
        );
    }
);
InputWithCount.displayName = "InputWithCount";