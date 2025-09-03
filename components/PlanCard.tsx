import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './UI/card'

type PlanCardProps = {
    title: string,
}

export default function PlanCard(props: PlanCardProps) {
    const { title } = props;
    return (
        <Card className='w-[30%]'>
            <CardHeader>
                <CardTitle className='text-left'>${title}</CardTitle>
                <CardDescription className='text-left'>
                    This is a plan card component. show priority, status, etc
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
