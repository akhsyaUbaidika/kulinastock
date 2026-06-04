import { supabase } from "@/lib/supabase";

export async function GET() {

    try {

        const {
            data,
            error
        } = await supabase
            .from("stock_transactions")
            .select(`
                id,
                transaction_type,
                qty,
                transaction_date,
                created_at,
                items (
                    id,
                    item_name,
                    unit
                )
            `)
            .order(
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
                data
                    .filter(
                        x =>
                            x.transaction_type === "IN"
                    )
                    .length,

            stockOut:
                data
                    .filter(
                        x =>
                            x.transaction_type === "OUT"
                    )
                    .length

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

            item_id,

            transaction_type,

            qty

        }

            =

            body;

        const {

            error

        }

            =

            await supabase.rpc(

                "apply_stock_transaction",

                {

                    p_item_id:
                        Number(item_id),

                    p_user_id:
                        1,

                    p_type:
                        transaction_type,

                    p_qty:
                        Number(qty),

                    p_date:
                        new Date()
                            .toISOString()
                            .split("T")[0]

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