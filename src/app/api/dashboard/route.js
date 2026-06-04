import { supabase } from "@/lib/supabase";

export async function GET() {

    try {

        const [
            itemsRes,
            txRes,
        ] = await Promise.all([

            supabase
                .from("items")
                .select("*"),

            supabase
                .from(
                    "stock_transactions"
                )
                .select("*")

        ]);



        if (
            itemsRes.error
        ) {

            throw new Error(
                itemsRes.error
                    .message
            );

        }



        if (
            txRes.error
        ) {

            throw new Error(
                txRes.error
                    .message
            );

        }



        const items =
            itemsRes.data ||
            [];

        const tx =
            txRes.data ||
            [];



        const totalItems =
            items.length;



        const currentStock =
            items.reduce(

                (
                    sum,
                    item
                ) =>

                    sum +

                    (
                        item.current_stock
                        ||
                        0
                    ),

                0

            );



        const historicalRecords =
            tx.length;



        const txCount =
            {};

        tx.forEach(
            row => {

                txCount[
                    row.item_id
                ] =

                    (
                        txCount[
                        row.item_id
                        ]

                        ||

                        0
                    )

                    +

                    1;

            }
        );



        const forecastReady =
            Object
                .values(
                    txCount
                )
                .filter(
                    v =>
                        v >= 7
                )
                .length;



        const lowStock =
            items

                .filter(

                    item =>

                        item
                            .current_stock

                        <=

                        item
                            .minimum_stock

                )

                .sort(

                    (
                        a,
                        b
                    ) =>

                        a.current_stock
                        -
                        b.current_stock

                )

                .slice(
                    0,
                    5
                );



        const priorityItem =

            lowStock
                .length

                ?

                {

                    id:
                        lowStock[0]
                            .id,

                    item_name:
                        lowStock[0]
                            .item_name,

                    current_stock:
                        lowStock[0]
                            .current_stock,

                }

                :

                null;



        return Response.json({

            success:
                true,

            summary: {

                totalItems,

                currentStock,

                historicalRecords,

                forecastReady,

            },

            lowStock,

            priorityItem,

        });

    }

    catch (
    err
    ) {

        return Response.json(

            {

                success:
                    false,

                message:
                    err.message,

            },

            {

                status:
                    500,

            }

        );

    }

}