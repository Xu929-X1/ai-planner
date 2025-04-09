import React from 'react'
import useAxios from '@/utils/useAxios';
import { endpoints } from '@/services/apis';
import GoalCard from '@/components/GoalCard';
import MyInput from '@/components/UI/MyInput';
import { MyButton } from '@/components/UI/MyButton';

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
        <div>
            <GoalCard goal={data as MVPResponseType | undefined} />
            <MyInput type="text" placeholder='Enter your goal here...' className='w-full mb-4' onChange={(e) => setGoal(e.target.value)} />
            <MyButton onClick={() => {
                if (!goal || !goal.trim().length) return;
                refetch();
            }}>
                Start Planning
            </MyButton>
        </div>
    )
}
