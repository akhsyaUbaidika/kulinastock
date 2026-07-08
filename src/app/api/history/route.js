import { supabase } from "@/lib/supabase";

import { cookies }
    from "next/headers";

export async function GET(request) {

    try {

        const { searchParams } =
            new URL(request.url);

        const itemId =
            searchParams.get(
                "item_id"
            );

        // const {
        //     data,
        //     error
        // } = await supabase
        //     .from("stock_transactions")
        //     .select(`
        //         id,
        //         transaction_type,
        //         qty,
        //         transaction_date,
        //         created_at,
        //         items (
        //             id,
        //             item_name,
        //             unit
        //         )
        //     `)
        //     .order(
        //         "id",
        //         {
        //             ascending: false
        //         }
        //     );

        let query =
            supabase

                .from(
                    "stock_transactions"
                )

                .select(`
            id,
            item_id,
            transaction_type,
            qty,
            note,
            transaction_date,
            created_at,
            items (
                id,
                item_name,
                small_unit
            ),
            users (
                id,
                username
            )
        `);

        if (itemId) {

            query =
                query.eq(
                    "item_id",
                    itemId
                );

        }

        const {
            data,
            error
        }
            =
            await query.order(
                "id",
                {
                    ascending: false
                }
            );


        if (error)
            throw error;

        const summary = {

            total:
                data.length,

            stockIn:
                data.filter(
                    x =>
                        [
                            "IN",
                            "ADJ_IN"
                        ].includes(
                            x.transaction_type
                        )
                ).length,

            stockOut:
                data.filter(
                    x =>
                        [
                            "OUT",
                            "ADJ_OUT"
                        ].includes(
                            x.transaction_type
                        )
                ).length,

        };

        return Response.json({

            success:
                true,

            summary,

            data

        });

    }

    catch (err) {

        return Response.json(

            {

                success:
                    false,

                message:
                    err.message

            },

            {

                status:
                    500

            }

        );

    }

}

export async function POST(
    request
) {

    try {

        const body =
            await request.json();

        const {
            transactions,
            skip_validation = false
        } = body;
        console.log({
            transactions: transactions.length,
            skip_validation
        });

        const cookieStore =
            await cookies();

        const auth =
            cookieStore.get(
                "kulinastock_auth"
            );

        if (!auth) {

            return Response.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                {
                    status: 401
                }
            );

        }

        const user =
            JSON.parse(
                auth.value
            );

        const {

            error

        }

            =

            await supabase.rpc(

                "apply_stock_transactions_bulk",

                {

                    p_transactions:
                        transactions,

                    p_user_id:
                        user.id,

                    p_skip_validation: skip_validation

                }


            );

        if (error)
            throw error;

        return Response.json({

            success:
                true

        });

    }

    catch (err) {

        return Response.json(

            {

                success:
                    false,

                message:
                    err.message

            },

            {

                status:
                    500

            }

        );

    }

}