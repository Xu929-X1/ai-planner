import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json("Get plan by ID")
}

export async function POST() {
    return NextResponse.json("Create plan")

}

export async function PUT() {
    return NextResponse.json("Update plan by ID")
}