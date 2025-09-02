import { withApiHandler } from "@/lib/api/withApiHandlers";
import { cookies } from "next/headers";

export const POST = withApiHandler(async () => {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",           
        sameSite: "lax",
    });

    return { message: "Log out" }; 
})