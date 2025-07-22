import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: NextRequest, context: { params: { planId: string } }) {

    const plan = await prisma.plan.findUnique({
        where: {
            id: Number(context.params.planId)
        },
        include: {
            Tasks: true,
        },
    });

    return NextResponse.json(plan);
}

export async function PUT(req: NextRequest, context: { params: { planId: string } }) {

    const { title, description, priority, dueDate } = await req.json();
    const planId = Number(context.params.planId);

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

    return NextResponse.json(updatedPlan);
}

export async function DELETE(req: NextRequest, context: { params: { planId: string } }) {

    const planId = Number(context.params.planId);

    const deletedPlan = await prisma.plan.update({
        where: {
            id: planId,
        },
        data: {
            status: "CANCELLED",
        }
    });

    return NextResponse.json(deletedPlan);
}