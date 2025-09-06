import { withApiHandler } from "@/lib/api/withApiHandlers";
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

    (await cookies()).set('google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    //check if the user has acct already, if so generate auth_token, if not register and generate

})