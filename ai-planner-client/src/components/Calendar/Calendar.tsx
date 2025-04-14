import React, { useEffect, useState } from 'react';
import CalendarDayView from './CalendarDayView';
import { MyButton } from '../UI/MyButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import TimeColumn from './TimeColumn';

dayjs.extend(isoWeek);

const getWeekDates = (date: Dayjs, mode: 'workWeek' | 'allWeek') => {
    const start = date.startOf('week').add(1, 'day'); // 周一
    const length = mode === 'workWeek' ? 5 : 7;
    return Array.from({ length }, (_, i) => start.add(i, 'day'));
};

export default function Calendar() {
    const [timeGridTimeSpan, setTimeGridTimeSpan] = useState(30);
    const [mode, setMode] = useState<'workWeek' | 'allWeek'>('workWeek');
    const [currentDate, setCurrentDate] = useState(dayjs());

    const columnCount = mode === 'workWeek' ? 5 : 7;
    const columnWidth = 140;
    const rowHeight = 40;
    const totalMinutes = 24 * 60;
    const timeGridCount = totalMinutes / timeGridTimeSpan;
    const weekDates = getWeekDates(currentDate, mode);
    const getNowOffsetPx = () => {
        const now = dayjs();
        if (!now.isSame(dayjs(), 'day')) return 0;

        const minutes = now.hour() * 60 + now.minute();
        return (minutes / timeGridTimeSpan) * rowHeight;
    };
    return (
        <div className="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-screen w-screen">
            <header className="bg-gray-800 text-white p-4 justify-between flex items-center">
                <h1 className="text-xl font-bold">Calendar</h1>
                <div className="flex gap-4 items-center">
                    <DatePicker
                        selected={currentDate.toDate()}
                        onChange={(date) => setCurrentDate(dayjs(date))}
                        dateFormat="yyyy-MM-dd"
                        className="text-white px-2 py-1 border-white border-2 rounded-lg focus:outline-none focus:border-blue-500 "
                    />
                    <MyButton onClick={() => setMode('allWeek')}>7-Day</MyButton>
                    <MyButton onClick={() => setMode('workWeek')}>5-Day</MyButton>
                </div>
            </header>

            <main className="overflow-auto w-full">
                <div className="w-full">
                    {/* 顶部日期栏 */}
                    <div className="flex sticky top-0 bg-white w-full">
                        <div className="w-[60px] shrink-0" />
                        {weekDates.map((date) => (
                            <div
                                key={date.toString()}
                                className="text-center font-bold border-b border-gray-300 py-2 text-gray-950 flex-1"
                            >
                                {date.format('ddd M/D')}
                            </div>
                        ))}
                    </div>

                    <div className="relative flex w-full">
                        <div
                            className="absolute left-[60px] right-0 h-[1px] border-t border-dashed border-red-300 z-20 pointer-events-none"
                            style={{
                                top: `${getNowOffsetPx()}px`
                            }}
                        />

                        <TimeColumn timeGridCount={timeGridCount} rowHeight={rowHeight} />

                        {weekDates.map((date) => (
                            <div className="flex-1" key={date.toString()}>
                                <CalendarDayView
                                    mode={mode}
                                    timeGridTimeSpan={timeGridTimeSpan}
                                    rowHeight={rowHeight}
                                    date={date}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">© 2025 ChronoMind</footer>
        </div>
    );
}
