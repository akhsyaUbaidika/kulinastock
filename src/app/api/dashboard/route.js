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
import { supabase } from "@/lib/supabase";

export async function GET() {

    try {

        const [
            itemsRes,
            txRes,
            forecastRes,
        ] = await Promise.all([

            supabase
                .from("items")
                .select("*"),

            supabase
                .from("stock_transactions")
                .select("*", {
                    count: "exact",
                    head: true
                }),
            supabase
                .rpc("get_forecast_ready_count")

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

        // const tx =
        //     txRes.data ||
        //     [];



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
            txRes.count || 0;



        // const txCount =
        //     {};

        // const forecastReady = 0;

        // tx.forEach(
        //     row => {

        //         txCount[
        //             row.item_id
        //         ] =

        //             (
        //                 txCount[
        //                 row.item_id
        //                 ]

        //                 ||

        //                 0
        //             )

        //             +

        //             1;

        //     }
        // );



        // const forecastReady =
        //     Object
        //         .values(
        //             txCount
        //         )
        //         .filter(
        //             v =>
        //                 v >= 7
        //         )
        //         .length;

        const forecastReady =
            forecastRes.data || 0;



        const lowStock =
            items

                .filter(

                    item =>

                        item.current_stock <=
                        item.minimum_stock

                )

                .map(item => ({

                    ...item,

                    stock_ratio:

                        item.minimum_stock > 0

                            ? item.current_stock /
                            item.minimum_stock

                            : 1

                }))

                .sort(

                    (a, b) =>

                        a.stock_ratio -
                        b.stock_ratio

                )

                .slice(0, 5);


        const lowStockPlanning = [];

        for (const item of lowStock) {

            console.log(
                "Forecasting:",
                item.item_name
            );

            const {
                data: histories,
                error: historyError
            } = await supabase

                .from("stock_transactions")

                .select("*")

                .eq(
                    "item_id",
                    item.id
                )

                .eq(
                    "transaction_type",
                    "OUT"
                )

                .order(
                    "transaction_date",
                    {
                        ascending: false
                    }
                );

            if (historyError) {

                throw historyError;

            }

            console.log(
                item.item_name,
                histories.length
            );
            const historicalSeries =
                aggregateDemand(
                    histories
                );

            console.log(

                item.item_name,

                historicalSeries.length

            );
            const fullSeries =
                extractSeries(
                    historicalSeries
                );

            console.log(

                item.item_name,

                fullSeries.length

            );

            if (
                historicalSeries.length < 14
            ) {

                console.log(
                    "SUCCESS",
                    item.item_name
                );
                lowStockPlanning.push({

                    ...item,

                    total_prediction: "-",

                    daily_prediction:
                        Array(3).fill("-"),

                    recommendation: {

                        suggested_restock: 0,

                        raw_restock: 0

                    },

                    status:
                        "INSUFFICIENT_HISTORY"

                });

                continue;
            }
            const methods = [

                evaluateModel({
                    name: "SES",
                    actual: fullSeries,
                    fitted: SES(
                        fullSeries,
                        3
                    ).forecast
                }),

                evaluateModel({
                    name: "Holt",
                    actual: fullSeries,
                    fitted: Holt(
                        fullSeries,
                        3
                    ).forecast
                }),

                evaluateModel({
                    name: "Holt-Winters",
                    actual: fullSeries,
                    fitted: HoltWinters(
                        fullSeries,
                        3
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
                            3
                        );

                    break;

                case "Holt":

                    finalModel =
                        Holt(
                            fullSeries,
                            3
                        );

                    break;

                default:

                    finalModel =
                        HoltWinters(
                            fullSeries,
                            3
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

            lowStockPlanning.push({

                ...item,

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
                    recommendation.status

            });

        }

        const priorityItem =
            lowStockPlanning.find(
                item =>
                    item.status ===
                    "RESTOCK"
            ) ||

            lowStockPlanning.find(
                item =>
                    item.status ===
                    "INSUFFICIENT_HISTORY"
            ) ||

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

            lowStock:
                lowStockPlanning,

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