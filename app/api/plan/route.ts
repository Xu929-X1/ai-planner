import { NextResponse } from "next/server";

async function GET() {
    return NextResponse.json("Get plan by ID")
}

async function POST() {
    return NextResponse.json("Create plan")

}

async function PUT() {
    return NextResponse.json("Update plan by ID")
}