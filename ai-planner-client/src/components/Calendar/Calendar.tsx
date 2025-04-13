import React from 'react'
import CalendarDayView from './CalendarDayView'
import { MyButton } from '../UI/MyButton';

export default function Calendar() {
    const [timeGridTimeSpan, setTimeGridTimeSpan] = React.useState(30) // in minutes;
    const [mode, setMode] = React.useState<'workHour' | 'allDay'>('workHour');


    return (
        <div className="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-screen w-screen">
            <header className="bg-gray-800 text-white p-4 justify-between flex items-center">

                <h1>Calendar</h1>
                <div className='flex gap-4'>

                    <MyButton onClick={() => setMode("allDay")}>All Day</MyButton>
                    <MyButton onClick={() => setMode("workHour")}>Work Day</MyButton>
                </div>

            </header>
            <main className="flex justify-center items-center overflow-auto">
                <CalendarDayView mode={mode} timeGridTimeSpan={timeGridTimeSpan} />
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                
            </footer>
        </div>
    )
}
