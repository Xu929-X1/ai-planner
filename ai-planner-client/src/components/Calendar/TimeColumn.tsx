export default function TimeColumn({ timeGridCount, rowHeight }: { timeGridCount: number; rowHeight: number }) {
    const getTimeString = (index: number) => {
        const minutes = index * 30;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col w-[60px] border-r border-gray-300 shrink-0">
            {Array.from({ length: timeGridCount }).map((_, index) => (
                <div
                    key={index}
                    className="text-xs text-right pr-1 text-gray-500 leading-none"
                    style={{ height: `40px`, lineHeight: `40px` }}
                >
                    {getTimeString(index)}
                </div>
            ))}
        </div>
    );
}