import { NextResponse } from "next/server";

import { supabase }
    from "@/lib/supabase";

export async function GET(request) {

    try {

        const { searchParams } =
            new URL(request.url);

        const days =
            parseInt(
                searchParams.get("days")
            ) || 3;

        const itemsParam =
            searchParams.get("items");

        if (!itemsParam) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Items required"
                },
                {
                    status: 400
                }
            );

        }

        const itemIds =
            itemsParam
                .split(",")
                .map(Number);

        /*
        ========================
        GET ITEMS
        ========================
        */

        const {
            data: items,
            error: itemsError
        } = await supabase
            .from("items")
            .select("*")
            .in("id", itemIds);

        if (itemsError) {

            throw itemsError;

        }

        /*
        ========================
        GET HISTORY
        ========================
        */

        const {
            data: histories,
            error: historyError
        } = await supabase
            .from("stock_transactions")
            .select("*")
            .in("item_id", itemIds)
            .eq("transaction_type", "OUT")
            .order(
                "transaction_date",
                {
                    ascending: false
                }
            );

        if (historyError) {

            throw historyError;

        }

        /*
        ========================
        SIMPLE PREDICTION
        AVG DAILY OUT
        ========================
        */

        const result =
            items.map(item => {

                const itemHistory =
                    histories.filter(
                        h =>
                            h.item_id ===
                            item.id
                    );

                const avgDaily =
                    itemHistory.length > 0
                        ? Math.ceil(
                            itemHistory.reduce(
                                (
                                    sum,
                                    row
                                ) =>
                                    sum +
                                    row.qty,
                                0
                            ) /
                            itemHistory.length
                        )
                        : 0;

                const dailyPrediction =
                    [];

                for (
                    let i = 0;
                    i < days;
                    i++
                ) {

                    dailyPrediction.push(
                        avgDaily
                    );

                }

                const totalPrediction =
                    dailyPrediction.reduce(
                        (a, b) => a + b,
                        0
                    );

                const currentStock =
                    item.current_stock;

                const restockSuggestion =
                    Math.max(
                        totalPrediction -
                        currentStock,
                        0
                    );

                let status =
                    "SAFE";

                if (
                    currentStock <
                    totalPrediction
                ) {

                    status =
                        "RESTOCK";

                }

                if (
                    currentStock <
                    totalPrediction * 0.5
                ) {

                    status =
                        "CRITICAL";

                }

                return {

                    item_id:
                        item.id,

                    item_name:
                        item.item_name,

                    unit:
                        item.unit,

                    current_stock:
                        currentStock,

                    daily_prediction:
                        dailyPrediction,

                    total_prediction:
                        totalPrediction,

                    restock_suggestion:
                        restockSuggestion,

                    status

                };

            });

        return NextResponse.json({

            success: true,

            data: result

        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message
            },
            {
                status: 500
            }
        );

    }

}