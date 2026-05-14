import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const pathname = req.nextUrl.pathname;

    // no autenticado
    if (!token) {

        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    // rutas admin
    if (
        pathname.startsWith("/admin") &&
        token.role !== "ADMIN"
    ) {

        return NextResponse.redirect(
            new URL("/calendar", req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/rooms/:path*",
        "/my-bookings/:path*",
        "/calendar/:path*",
        "/admin/:path*",
    ],
};