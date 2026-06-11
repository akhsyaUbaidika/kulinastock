import { cookies }
    from "next/headers";

import { NextResponse }
    from "next/server";

export async function GET() {

    const cookieStore =
        await cookies();

    const auth =
        cookieStore.get(
            "kulinastock_auth"
        );

    if (!auth) {

        return NextResponse.json({

            authenticated:
                false,

        });

    }

    return NextResponse.json({

        authenticated: true,

        user:
            JSON.parse(
                auth.value
            ),

    });

}