import React from 'react'
import { MyButton } from './UI/MyButton'
import MyInput from './UI/MyInput'
import useAxios from '@/utils/useAxios';
import { endpoints } from '@/services/apis';
import GoalCard from './GoalCard';

type MVPResponseType = {
    start_time: string;
    end_time: string;
    title: string;
}

export default function GoalInput() {
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

    console.log(data);
    return (
        <div>
            <GoalCard goal={data as MVPResponseType | undefined} />
            <MyInput type="text" placeholder='Enter your goal here...' className='w-full mb-4' onChange={(e) => setGoal(e.target.value)} />
            <MyButton onClick={() => {
                console.log('clicked', goal);
                if (!goal || !goal.trim().length) return;
                refetch();
            }}>
                Start Planning
            </MyButton>
        </div>
    )
}
