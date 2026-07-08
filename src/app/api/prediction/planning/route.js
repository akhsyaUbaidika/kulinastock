import { NextResponse } from "next/server";

import { supabase }
    from "@/lib/supabase";

import { aggregateDemand }
    from "@/lib/forecasting/aggregateDemand";

import { extractSeries }
    from "@/lib/forecasting/extractSeries";

import { evaluateModel }
    from "@/lib/forecasting/evaluateModel";

import { selectBestModel }
    from "@/lib/forecasting/selectBestModel";

import { buildPredictions }
    from "@/lib/forecasting/buildPredictions";

import { generateRecommendation }
    from "@/lib/forecasting/recommendation";

import { SES }
    from "@/lib/forecasting/ses";

import { Holt }
    from "@/lib/forecasting/holt";

import { HoltWinters }
    from "@/lib/forecasting/holtWinters";

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

                const historicalSeries =
                    aggregateDemand(
                        itemHistory
                    );

                if (
                    historicalSeries.length < 14
                ) {

                    return {
                        item_id: item.id,
                        item_name: item.item_name,

                        daily_prediction:
                            Array(days).fill("-"),

                        total_prediction:
                            "-",

                        current_stock:
                            item.current_stock,

                        small_unit:
                            item.small_unit,

                        large_unit:
                            item.large_unit,

                        recommendation: {
                            suggested_restock: 0,
                            raw_restock: 0
                        },

                        status:
                            "INSUFFICIENT_HISTORY",

                        data_health: {
                            status:
                                "INSUFFICIENT_HISTORY",

                            observation_count:
                                historicalSeries.length,

                            minimum_required:
                                14
                        }
                    };

                }

                const fullSeries =
                    extractSeries(
                        historicalSeries
                    );

                const methods = [

                    evaluateModel({
                        name: "SES",
                        actual: fullSeries,
                        fitted: SES(
                            fullSeries,
                            days
                        ).forecast
                    }),

                    evaluateModel({
                        name: "Holt",
                        actual: fullSeries,
                        fitted: Holt(
                            fullSeries,
                            days
                        ).forecast
                    }),

                    evaluateModel({
                        name: "Holt-Winters",
                        actual: fullSeries,
                        fitted: HoltWinters(
                            fullSeries,
                            days
                        ).forecast
                    })

                ];

                const bestMethod =
                    selectBestModel(
                        methods
                    );

                let finalModel;

                switch (
                bestMethod.name
                ) {

                    case "SES":
                        finalModel =
                            SES(
                                fullSeries,
                                days
                            );
                        break;

                    case "Holt":
                        finalModel =
                            Holt(
                                fullSeries,
                                days
                            );
                        break;

                    default:
                        finalModel =
                            HoltWinters(
                                fullSeries,
                                days
                            );
                }

                const lastTransactionDate =
                    historicalSeries[
                        historicalSeries.length - 1
                    ]?.date;

                const forecastStartDate =
                    new Date(
                        lastTransactionDate
                    );

                forecastStartDate.setDate(
                    forecastStartDate.getDate() + 1
                );

                const predictions =
                    buildPredictions(
                        finalModel.forecast,
                        forecastStartDate
                            .toISOString()
                            .split("T")[0]
                    );

                const recommendation =
                    generateRecommendation({

                        currentStock:
                            item.current_stock,

                        minimumStock:
                            item.minimum_stock,

                        purchaseMultiple:
                            item.purchase_multiple,

                        predictions,

                        qtyPerLargeUnit:
                            item.qty_per_large_unit

                    });





                return {

                    item_id: item.id,

                    item_name: item.item_name,

                    current_stock:
                        item.current_stock,

                    small_unit:
                        item.small_unit,

                    large_unit:
                        item.large_unit,

                    qty_per_large_unit:
                        item.qty_per_large_unit,

                    purchase_multiple:
                        item.purchase_multiple,

                    best_method:
                        bestMethod.name,

                    daily_prediction:
                        predictions.map(
                            p => p.qty
                        ),

                    total_prediction:
                        predictions.reduce(
                            (sum, p) =>
                                sum + p.qty,
                            0
                        ),

                    recommendation,

                    status:
                        recommendation.status,

                    last_transaction_date:
                        lastTransactionDate,

                    forecast_start_date:
                        forecastStartDate
                            .toISOString()
                            .split("T")[0],

                    missing_days:
                        Math.max(
                            Math.floor(
                                (
                                    new Date() -
                                    new Date(
                                        lastTransactionDate
                                    )
                                ) / 86400000
                            ) - 1,
                            0
                        )

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