import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt";

const privateRoutes = [
    "/private",
    "/dashboard",
    "/secret",
];

// This function can be marked `async` if using `await` inside
export async function proxy(req) {
    const token = await getToken({ req });
    const reqPath = req.nextUrl.pathname;
    const isAuthenticated = Boolean(token);
    const isUser = token?.role === "user";
    const isAdmin = token?.role === "admin";
    const isPrivate = privateRoutes.some(route => reqPath.startsWith(route));

    if (!isAuthenticated && isPrivate) {
        const loginUrl = new URL("/api/auth/signin", req.url);
        loginUrl.searchParams.set("callback", reqPath);
        return NextResponse.redirect(loginUrl);
    }

    // return NextResponse.redirect(new URL("/", req.url))
    return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
    matcher: ["/private/:path*", "/dashboard/:path*", "/secret/:path*"],
}