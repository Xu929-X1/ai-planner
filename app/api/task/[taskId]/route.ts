import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ taskId: string }> }) {
    const params = await context.params;
    const taskId = Number(params.taskId);

    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
        }
    });

    if (!task) {
        return new Response("Task not found", { status: 404 });
    }

    return new Response(JSON.stringify(task), {
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ taskId: string }> }) {
    const params = await context.params;
    const taskId = Number(params.taskId);
    const { title, description, status, priority, dueDate } = await req.json();

    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
        },
    });

    return NextResponse.json(updatedTask);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ taskId: string }> }) {
    const params = await context.params;
    const taskId = Number(params.taskId);

    const deletedTask = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            status: "CANCELLED",
        }
    });

    return NextResponse.json(deletedTask);
}