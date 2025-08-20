import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserInfo } from "../utils";
export async function GET(req: NextRequest) {
    //get all plans for the user
    const userInfo = await getUserInfo(req);
    const plans = await prisma.plan.findMany({
        include: {
            Tasks: true,
        },
        where: {
            userId: Number(userInfo.id),
        }
    });
    return NextResponse.json(plans);
}
//this is the endpoint to create a new plan without AI
export async function POST(req: NextRequest) {
    //create a new plan
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

    return NextResponse.json(newPlan);

}