import { AppError } from "@/lib/api/Errors";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const GET = withApiHandler(async (req: NextRequest, context?: { params?: Promise<{ taskId?: string }> }) => {
    try {
        if (!context) {
            throw AppError.badRequest("Task ID is required");
        }
        const params = await context.params;
        if (!params || !params.taskId) {
            throw AppError.badRequest("Task ID is required");
        }
        const taskId = Number(params.taskId);

        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            }
        });

        if (!task) {
            throw AppError.notFound("Task not found");
        }

        return task;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to fetch task");
        }
    }
});

export const PUT = withApiHandler(async (req: NextRequest, context?: { params?: Promise<{ taskId?: string }> }) => {
    try {
        if (!context) {
            throw AppError.badRequest("Task ID is required");
        }
        const params = await context.params;
        if (!params || !params.taskId) {
            throw AppError.badRequest("Task ID is required");
        }
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
        return updatedTask;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to update task");
        }
    }
});

export const DELETE = withApiHandler(async (req: NextRequest, context?: { params?: Promise<{ taskId?: string }> }) => {
    try {
        if (!context) {
            throw AppError.badRequest("Task ID is required");
        }
        const params = await context.params;
        if (!params || !params.taskId) {
            throw AppError.badRequest("Task ID is required");
        }
        const taskId = Number(params.taskId);

        const deletedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                status: "CANCELLED",
            }
        });

        return deletedTask;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to delete task");
        }
    }
});