import React from 'react'
import { Card } from './UI/card'

export type GoalCardProps = { goal?: { title: string, start_time: string, end_time: string } }
export default function GoalCard(props: GoalCardProps) {
  return (
    <Card className='w-full h-32 flex flex-col justify-center items-center p-4'>
      <h1 className='text-2xl font-bold'>{props.goal?.title}</h1>
      <div className='flex flex-col'>
        <p className='text-sm'>Start Time: {props.goal?.start_time}</p>
        <p className='text-sm'>End Time: {props.goal?.end_time}</p>
      </div>
    </Card>
  )
}
