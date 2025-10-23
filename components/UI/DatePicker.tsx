import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { cn } from "@/lib/utils"

type DatePickerProps = React.ComponentPropsWithoutRef<typeof Button> & {
    initialDate?: Date
    onDateChange?: (date: Date) => void,
    className?: string
}
export function DatePicker(props: DatePickerProps) {
    const [date, setDate] = React.useState<Date>()
    const { className } = props;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className={cn(className, "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal")}
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    )
}