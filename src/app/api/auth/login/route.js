import { NextResponse }
    from "next/server";

import bcrypt
    from "bcryptjs";

import { supabase }
    from "@/lib/supabase";

export async function POST(
    request
) {

    try {

        const body =
            await request.json();

        const {
            username,
            password,
        } = body;

        const {
            data: user,
            error,
        } = await supabase
            .from("users")
            .select("*")
            .eq(
                "username",
                username
            )
            .single();

        if (
            error ||
            !user
        ) {

            return NextResponse.json(
                {
                    error:
                        "Invalid credentials"
                },
                {
                    status: 401
                }
            );

        }

        const valid =
            bcrypt.compareSync(
                password,
                user.password
            );

        if (!valid) {

            return NextResponse.json(
                {
                    error:
                        "Invalid credentials"
                },
                {
                    status: 401
                }
            );

        }

        const response =
            NextResponse.json({

                success: true,

                user: {

                    id:
                        user.id,

                    username:
                        user.username,

                    role:
                        user.role,

                },

            });

        response.cookies.set(
            "kulinastock_auth",

            JSON.stringify({

                id:
                    user.id,

                role:
                    user.role,

            }),

            {

                httpOnly: true,

                secure:
                    process.env
                        .NODE_ENV
                    === "production",

                sameSite:
                    "strict",

                path: "/",

                maxAge:
                    60 * 60 * 24,

            }
        );

        return response;

    } catch (err) {

        return NextResponse.json(
            {
                error:
                    "Server error"
            },
            {
                status: 500
            }
        );

    }

}