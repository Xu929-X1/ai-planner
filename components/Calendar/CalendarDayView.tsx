import { Dayjs } from "dayjs";

type CalendarDayViewProps = {
    mode: 'workWeek' | 'allWeek';
    timeGridTimeSpan: number;
    rowHeight: number;
    date: Dayjs;
};

export default function CalendarDayView({ timeGridTimeSpan, rowHeight }: CalendarDayViewProps) {
    const timeGridCount = (24 * 60) / timeGridTimeSpan;

    return (
        <div
            className="grid border-l border-r border-gray-300 shrink-0"
            style={{
                gridTemplateRows: `repeat(${timeGridCount}, ${rowHeight}px)`,
                width: '100%'
            }}
        >
            {Array.from({ length: timeGridCount }).map((_, index) => {
                const minutes = index * timeGridTimeSpan;
                const hour = Math.floor(minutes / 60);
                const isActiveHour = hour >= 6 && hour < 22;

                return (
                    <div
                        key={index}
                        className={`w-full border-b text-sm text-center 
                            ${index % 2 === 0 ? 'border-gray-950' : 'border-gray-300'} 
                            ${isActiveHour ? 'bg-blue-50' : 'bg-gray-100'} 
                            hover:bg-gray-200`}
                        style={{ height: `${rowHeight}px` }}
                    >
                        {

                        }
                    </div>
                );
            })}
        </div>
    );
}

