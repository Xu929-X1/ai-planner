import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './UI/card'


export default function PlanCard() {
    return (
        <Card className='w-[30%]'>
            <CardHeader>
                <CardTitle className='text-left'>Plan Card</CardTitle>
                <CardDescription className='text-left'>
                    This is a plan card component. show priority, status, etc
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
