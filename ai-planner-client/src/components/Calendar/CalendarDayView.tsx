import React, { useEffect } from 'react'

const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 100;
const CALENDAR_MARGIN = 200;
type CalendarDayViewProps = {
    mode: 'workHour' | 'allDay'
    timeGridTimeSpan: number // in minutes
}
export default function CalendarDayView(props: CalendarDayViewProps) {
    const [gridHeight, setGridHeight] = React.useState(0);
    const [gridWidth, setGridWidth] = React.useState(0);
    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            const headerHeight = HEADER_HEIGHT; // Adjust this value based on your header height
            const footerHeight = FOOTER_HEIGHT; // Adjust this value based on your footer height
            const calculatedHeight = windowHeight - headerHeight - footerHeight - CALENDAR_MARGIN; // 200 is the margin for the calendar container
            setGridHeight(calculatedHeight);
            if (props.mode === 'workHour') {
                setGridWidth(Math.floor((windowWidth - 200) / 5)); // Adjust this value based on your sidebar width
            }
            else {
                setGridWidth(Math.floor((windowWidth - 200) / 7)); // Adjust this value based on your sidebar width
            }
            console.log(Math.floor((windowWidth - 200) / 5))
        };

        handleResize(); // Initial call to set the height

        window.addEventListener('resize', handleResize); // Add event listener for resize
        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup event listener on unmount
        };
    }, [props.mode]);

    function calculateTimeGridCount() {
        const totalMinutes = props.mode === 'workHour' ? 12 * 60 : 24 * 60;
        return totalMinutes / props.timeGridTimeSpan;
    }


    return (
        <div
            className="grid w-full "
            style={{ gridTemplateRows: `repeat(${calculateTimeGridCount()}, ${gridHeight / calculateTimeGridCount()}px)`, width: `${gridWidth}px` }}
        >
            {Array.from({ length: calculateTimeGridCount() }).map((_, index) => (
                <div
                    key={index}
                    className="w-full border-b border-gray-950 text-white text-sm text-center hover:bg-gray-400 "
                >
                    {/* 时间可以格式化输出 */}
                </div>
            ))}
        </div>
    )
}
