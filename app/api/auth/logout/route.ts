import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = NextResponse.json({
        message: "Log out",
    });

    response.cookies.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    return response;
}