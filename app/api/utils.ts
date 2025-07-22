import { NextRequest } from "next/server";
import * as jose from "jose";
export async function getUserInfo(req: NextRequest) {
    const token = req.cookies.get('auth_token');
    if (!token) {
        throw new Error("Unauthorized");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    const payload = await jose.jwtVerify(token.value, secret);
    return payload.payload;
}