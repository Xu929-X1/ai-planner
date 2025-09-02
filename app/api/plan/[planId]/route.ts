import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/Errors";

export const GET = withApiHandler(async (req: NextRequest, context?: { params?: Promise<{ [key: string]: string }> }) => {
    try {

        if (!context) {
            throw AppError.badRequest("Plan ID is required");
        }
        const requestParams = await context.params;
        if (!requestParams || !requestParams.planId) {
            throw AppError.badRequest("Plan ID is required");
        }
        const planId = Number(requestParams.planId);
        const plan = await prisma.plan.findUnique({
            where: {
                id: (planId)
            },
            include: {
                Tasks: true,
            },
        });
        return plan;
    } catch (error) {
        console.error("Error fetching plan:", error);
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to fetch plan");
        }
    }
})

export const PUT = withApiHandler(async (req: NextRequest, context?: { params?: Promise<{ [key: string]: string }> }) => {
    try {
        if (!context) {
            throw AppError.badRequest("Plan ID is required");
        }
        const requestParams = await context.params;
        if (!requestParams || !requestParams.planId) {
            throw AppError.badRequest("Plan ID is required");
        }
        const planId = Number(requestParams.planId);
        const { title, description, priority, dueDate } = await req.json();

        const updatedPlan = await prisma.plan.update({
            where: {
                id: planId,
            },
            data: {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });
        return updatedPlan;
    } catch (error) {
        console.error("Error fetching plan:", error);
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to fetch plan");
        }
    }
})

export const DELETE = withApiHandler(async (req: NextRequest, context?: { params?: Promise<{ [key: string]: string }> }) => {
    try {
        if (!context) {
            throw AppError.badRequest("Plan ID is required");
        }
        const requestParams = await context.params;
        if (!requestParams || !requestParams.planId) {
            throw AppError.badRequest("Plan ID is required");
        }
        const planId = Number(requestParams.planId);

        const deletedPlan = await prisma.plan.update({
            where: {
                id: planId,
            },
            data: {
                status: "CANCELLED",
            }
        });
        return deletedPlan;
    } catch (error) {
        console.error("Error fetching plan:", error);
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to fetch plan");
        }
    }

})