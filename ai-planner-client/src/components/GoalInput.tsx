import React from 'react'
import { MyButton } from './UI/MyButton'
import MyInput from './UI/MyInput'

export default function GoalInput() {
    return (
        <div>

            <MyInput type="text" placeholder='Enter your goal here...' className='w-full mb-4' />
            <MyButton variant='default'>
                Start Planning
            </MyButton>
        </div>
    )
}
