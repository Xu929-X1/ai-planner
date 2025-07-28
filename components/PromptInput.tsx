import { useState } from "react";
import { InputWithCount } from "./InputWithCount";
import { Button } from "./UI/button";

export function PromptInput({ onSubmit, isLoading }: {
    onSubmit: (value: string) => void;
    isLoading: boolean;
}) {
    const [value, setValue] = useState('');

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(value);
            setValue('');
        }} className="flex gap-2 w-full">
            <InputWithCount
                maxLength={500}
                placeholder="What would you like to plan?"
                className="flex-1 bg-input"
                size={2}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Button disabled={isLoading || !value} type="submit">Generate</Button>
        </form>
    );
}