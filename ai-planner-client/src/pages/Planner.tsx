import React from 'react'
import useAxios from '@/utils/useAxios';
import { endpoints } from '@/services/apis';
import GoalCard from '@/components/GoalCard';
import MyInput from '@/components/UI/MyInput';
import { MyButton } from '@/components/UI/MyButton';
import Calendar from '@/components/Calendar/Calendar';
import CalendarDayView from '@/components/Calendar/CalendarDayView';

type MVPResponseType = {
    start_time: string;
    end_time: string;
    title: string;
}

export default function Planner() {
    const [goal, setGoal] = React.useState<string>('')
    const { data, error, loading, refetch } = useAxios({
        url: endpoints.createPlan.url,
        config: {
            method: endpoints.createPlan.method,
            data: {
                input: goal
            }
        },
        manual: true
    });

    return (
        <div className='flex flex-col items-center justify-center w-full h-full'>
            {data ? <GoalCard goal={data as MVPResponseType | undefined} /> : null}
            <MyInput type="text" placeholder='Enter your goal here...' className='w-full' onChange={(e) => setGoal(e.target.value)} />
            <MyButton onClick={() => {
                if (!goal || !goal.trim().length) return;
                refetch();
            }}>
                Start Planning
            </MyButton>
        </div>
    )
}
