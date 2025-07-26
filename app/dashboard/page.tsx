'use client'
import { Badge } from '@/components/UI/badge'
import { Button } from '@/components/UI/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/UI/resizable'
import { UserContext } from '@/contexts/userContext'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { endpoints } from '../api/route-helper'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Spinner } from '@/components/Spinner'
import { InputWithCount } from '@/components/InputWithCount'
export type TaskType = {
    id: number;
    title: string;
    description: string | null;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    dueDate: string | null;
    priority: number | null;
    userId: number;
    planId: number | null;
};

export type PlanType = {
    id: number;
    title: string;
    description: string | null;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    dueDate: string | null;
    priority: number | null;
    userId: number;
    Tasks: TaskType[];
};

export default function Dashboard() {
    const [plans, setPlans] = useState<PlanType[]>();
    const [selectedPlan, setSelectedPlan] = useState<PlanType>();
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const userContext = useContext(UserContext);
    async function refreshPlans() {
        setIsLoadingPlans(true);
        const res = await axios.get<PlanType[]>(endpoints.user.getAllPlans.get(userContext.user?.id || 0));
        setPlans(res.data);
        setIsLoadingPlans(false);
    }
    useEffect(() => {
        refreshPlans();
    }, [userContext.user?.id]);
    return (
        <div className='w-screen h-full pt-16 overflow-hidden'>
            <div
                className={`relative flex flex-wrap gap-2 bg-transparent backdrop-blur-md rounded-xl shadow-lg px-4 py-2 transition-all duration-30 hover:backdrop-blur-lg`}>
                <form className="flex gap-2 px-4 w-full pb-2">
                    <InputWithCount
                        maxLength={500}
                        placeholder="Have anything in mind? Talk to me!"
                        className="flex-1 bg-input border-border focus:border-primary"
                        size={2}
                    />
                    <Button type="submit" className="bg-accent hover:bg-primary text-accent-foreground transition-colors">
                        Generate Plan
                    </Button>
                </form>
            </div>

            <ResizablePanelGroup direction="horizontal">
                {/* 左侧 Plan Panel */}
                <ResizablePanel defaultSize={40} minSize={20}>
                    <Spinner spinning={isLoadingPlans}>
                        <div className="flex flex-col h-full p-4 bg-card border-r border-border">
                            {/* 顶部 header 工具区 */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Plans</h2>
                            </div>

                            {/* 可选 Filter / 标签 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Button variant="ghost" size="sm">All</Button>
                                <Button variant="ghost" size="sm">In Progress</Button>
                                <Button variant="ghost" size="sm">Completed</Button>
                            </div>

                            {/* Plan 列表 */}
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {/* Plan 卡片 / 列表项 */}
                                {
                                    plans?.map((plan) => {
                                        return (
                                            <div
                                                className={`${selectedPlan?.id === plan.id ? "bg-primary/20 shadow-md" : "bg-card shadow-sm"
                                                    } rounded-lg p-4 hover:shadow-md transition flex items-center justify-between border-accent-foreground`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPlan(selectedPlan?.id === plan.id ? undefined : plan);
                                                }}
                                                key={plan.id}
                                            >
                                                <div className='text-left'>
                                                    <h3 className="font-medium text-card-foreground">{plan.title}</h3>
                                                    <p className="text-muted text-sm">{plan.description}</p>
                                                </div>
                                                <div className='flex items-center justify-center gap-1 h-fit'>
                                                    <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                                        <DriveFileRenameOutlineIcon fontSize='small' />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={(e) => e.stopPropagation()}>
                                                        <DeleteOutlineIcon fontSize='small' />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {/* ... repeat */}
                            </div>
                        </div>
                    </Spinner>
                </ResizablePanel>
                <ResizableHandle className="hover:border-primary transition-colors duration-200" />
                {/* 右侧 Tasks Panel */}
                <ResizablePanel defaultSize={60} minSize={30}>
                    <div className="flex flex-col h-full p-4 bg-card gap-2">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Tasks</h2>
                        </div>

                        {/* Tabs (可选) */}
                        <div className="flex gap-2 mb-4">
                            <Button variant="ghost" size="sm">All</Button>
                            <Button variant="ghost" size="sm">Today</Button>
                            <Button variant="ghost" size="sm">Upcoming</Button>
                        </div>

                        {/* Task 列表 */}
                        {
                            selectedPlan?.Tasks.map((task) => {
                                return <div className="bg-card rounded-lg shadow-sm p-3 flex justify-between items-center hover:shadow-md transition" key={task.id}>
                                    <div>
                                        <h3 className="font-medium text-card-foreground text-left">{task.title}</h3>
                                        <p className="text-muted text-sm">Due: {task.dueDate}</p>
                                    </div>
                                    <Badge variant="secondary">{task.status}</Badge>
                                </div>
                            })
                        }

                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

        </div >
    )
}
