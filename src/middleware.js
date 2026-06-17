import { NextResponse } from "next/server";

export function middleware(request) {

    const auth =
        request.cookies.get(
            "kulinastock_auth"
        );

    const pathname =
        request.nextUrl.pathname;

    // public route
    if (
        pathname.startsWith("/login")
    ) {

        return NextResponse.next();

    }

    // no auth
    if (!auth) {

        return NextResponse.redirect(
            new URL(
                "/login",
                request.url
            )
        );

    }

    let user = null;

    try {

        user = JSON.parse(
            decodeURIComponent(
                auth.value
            )
        );

    } catch {

        return NextResponse.redirect(
            new URL(
                "/login",
                request.url
            )
        );

    }

    const role =
        user.role;

    /*
    =========================
    ANALYST ACCESS
    =========================
    */

    if (
        role === "analyst"
    ) {

        const allowed =
            [
                "/dataset-preview",
                "/forecast-lab"
            ];

        const isAllowed =
            allowed.some(
                route =>
                    pathname.startsWith(
                        route
                    )
            );

        if (!isAllowed) {

            return NextResponse.redirect(
                new URL(
                    "/dataset-preview",
                    request.url
                )
            );

        }

    }

    /*
    =========================
    OPERATIONAL ACCESS
    =========================
    */

    if (
        role === "operational"
    ) {

        const blocked =
            [
                "/dataset-preview",
                "/forecast-lab"
            ];

        const isBlocked =
            blocked.some(
                route =>
                    pathname.startsWith(
                        route
                    )
            );

        if (isBlocked) {

            return NextResponse.redirect(
                new URL(
                    "/dashboard",
                    request.url
                )
            );

        }

    }

    return NextResponse.next();

}

export const config = {

    matcher: [
        /*
         * Match all request paths
         * except:
         * - api
         * - _next
         * - static
         * - favicon
         */
        "/((?!api|_next|favicon.ico).*)",
    ],

};