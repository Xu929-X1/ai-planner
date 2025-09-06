import { AppError } from "@/lib/api/Errors";
import { withApiHandler } from "@/lib/api/withApiHandlers";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/utils";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type GoogleTokenRespType = {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    id_token: string,
    refresh_token_expires_in: number
}

type OpenIdUserInfoType = {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: boolean,
    at_hash: string,
    name: string,
    picture: string,
    given_name: string,
    faimily_name: string,
    iat: number,
    exp: number
}

//after get the code, handle get access token and user profile info, for now
export const POST = withApiHandler(async (req: NextRequest) => {
    const { code, codeVerifier, redirectUri } = await req.json();
    const body = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
    });

    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    const tokens: GoogleTokenRespType = await tokenResp.json();
    const user: OpenIdUserInfoType = decodeJwt(tokens.id_token);
    //check if the user has acct already, if so generate auth_token, if not register and generate
    //use 'sub' as the  key
    if (user) {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw AppError.internal("JWT Secret is not configured");
        const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name ?? undefined },
            create: {
                email: user.email,
                name: user.name ?? null,
            },
        });
        await prisma.authProviderAccounts.upsert({
            where: {
                provider_providerUserId: {
                    provider: 'google',
                    providerUserId: user.sub,
                },
            },
            update: {
                accessToken: tokens.access_token ?? undefined,
                expiresAt:
                    typeof tokens.expires_in === 'number'
                        ? new Date(Date.now() + tokens.expires_in * 1000)
                        : null,
                user: { connect: { id: dbUser.id } },
            },
            create: {
                provider: 'google',
                providerUserId: user.sub,
                accessToken: tokens.access_token ?? null,
                expiresAt:
                    typeof tokens.expires_in === 'number'
                        ? new Date(Date.now() + tokens.expires_in * 1000)
                        : null,
                user: { connect: { id: dbUser.id } },
            },
        });

        const token = await generateToken({ id: dbUser.id, email: dbUser.email }, JWT_SECRET);
        (await cookies()).set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
            maxAge: 2 * 60 * 60, // 2 hours
        })
    }


    (await cookies()).set('google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

})