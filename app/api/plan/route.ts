import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserInfo } from "../utils";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import { AppError } from "@/lib/api/Errors";

export const GET = withApiHandler(async (req: NextRequest) => {
    try {

        const userInfo = await getUserInfo(req);
        const plans = await prisma.plan.findMany({
            include: {
                Tasks: true,
            },
            where: {
                userId: Number(userInfo.id),
            }
        });
        return plans;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to fetch plans");
        }
    }
});

export const POST = withApiHandler(async (req: NextRequest) => {
    try {
        const { title, description, priority, dueDate, conversationId } = await req.json();
        const userInfo = await getUserInfo(req);
        const newPlan = await prisma.plan.create({
            data: {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: Number(userInfo.id),
                status: "IN_PROGRESS", // default status
                conversationId: conversationId ? Number(conversationId) : 0,
            },
        });

        return newPlan;
    } catch (error) {
        console.error("Error creating plan:", error);
        if (error instanceof AppError) {
            throw error;
        } else {
            throw AppError.internal("Failed to create plan");
        }
    }
});