import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({
        message: "Log out",
    });

    response.cookies.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    return response;
}