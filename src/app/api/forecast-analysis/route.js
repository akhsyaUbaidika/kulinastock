import { supabase }
    from "@/lib/supabase";

import {
    aggregateDemand
}
    from "@/lib/forecasting/aggregateDemand";

import {
    generateDatasetSummary
}
    from "@/lib/forecasting/datasetSummary";

import {
    splitDataset
}
    from "@/lib/forecasting/splitDataset";

import {
    extractSeries
}
    from "@/lib/forecasting/extractSeries";

import {
    evaluateModel
}
    from "@/lib/forecasting/evaluateModel";

import {
    selectBestModel
}
    from "@/lib/forecasting/selectBestModel";

import {
    buildPredictions
}
    from "@/lib/forecasting/buildPredictions";

import {
    generateRecommendation
}
    from "@/lib/forecasting/recommendation";

import {
    SES
}
    from "@/lib/forecasting/ses";

import {
    Holt
}
    from "@/lib/forecasting/holt";

import {
    HoltWinters
}
    from "@/lib/forecasting/holtWinters";
import {
    buildRanking
}
    from "@/lib/forecasting/buildRanking";
import {
    buildWeeklyPattern
}
    from "@/lib/forecasting/buildWeeklyPattern";

import {
    applyWeeklyAdjustment
}
    from "@/lib/forecasting/applyWeeklyAdjustment";
import {
    buildExplanation
}
    from "@/lib/forecasting/buildExplanation";

import {
    buildDiagnostic
}
    from "@/lib/forecasting/buildDiagnostic";

export async function POST(
    request
) {

    try {

        const body =
            await request.json();

        const itemId =
            Number(
                body.item_id
            );

        const horizon =
            Number(
                body.horizon || 7
            );

        const splitRatio =
            Number(
                body.split_ratio || 80
            );

        if (!itemId) {

            return Response.json(

                {

                    success: false,

                    message:
                        "item_id required"

                },

                {

                    status: 400

                }

            );

        }

        /*
        ==========================
        LOAD ITEM
        ==========================
        */

        const {

            data: item,

            error: itemError

        }

            =

            await supabase

                .from(
                    "items"
                )

                .select(`
                    id,
                    item_name,
                    category,
                    unit,
                    current_stock,
                    minimum_stock
                `)

                .eq(
                    "id",
                    itemId
                )

                .single();

        if (
            itemError
        ) {

            throw itemError;

        }

        /*
        ==========================
        LOAD HISTORY
        ==========================
        */

        const {

            data: transactions,

            error: trxError

        }

            =

            await supabase

                .from(
                    "stock_transactions"
                )

                .select(`
                    id,
                    item_id,
                    transaction_type,
                    qty,
                    transaction_date
                `)

                .eq(
                    "item_id",
                    itemId
                )

                .eq(
                    "transaction_type",
                    "OUT"
                )

                .order(
                    "transaction_date",
                    {

                        ascending:
                            true

                    }

                );

        if (
            trxError
        ) {

            throw trxError;

        }

        /*
        ==========================
        AGGREGATE DEMAND
        ==========================
        */

        const historicalSeries =

            aggregateDemand(
                transactions || []
            );

        if (

            historicalSeries.length
            <
            14

        ) {

            return Response.json({

                success: false,

                message:

                    "Not enough historical data. Minimum 14 observations required."

            });

        }

        console.log(
            "transactions:",
            transactions?.length
        );

        console.log(
            "historicalSeries:",
            historicalSeries
        );

        /*
        ==========================
        DATASET SUMMARY
        ==========================
        */

        const datasetSummary =

            generateDatasetSummary(
                historicalSeries
            );

        /*
        ==========================
        SPLIT DATASET
        ==========================
        */

        const {

            train,

            test,

            trainSize,

            testSize

        }

            =

            splitDataset(

                historicalSeries,

                splitRatio

            );

        const trainSeries =

            extractSeries(
                train
            );

        const testSeries =

            extractSeries(
                test
            );

        const fullSeries =

            extractSeries(
                historicalSeries
            );

        console.log(
            "train:",
            train.length
        );

        console.log(
            "test:",
            test.length
        );

        /*
        ==========================
        MODEL EVALUATION
        ==========================
        */

        const sesModel =

            SES(

                trainSeries,

                testSize

            );

        const holtModel =

            Holt(

                trainSeries,

                testSize

            );

        const hwModel =

            HoltWinters(

                trainSeries,

                testSize

            );

        console.log(
            "Actual Test:",
            testSeries
        );

        console.log(
            "HW Forecast:",
            hwModel.forecast
        );

        console.log(
            "Holt Forecast:",
            holtModel.forecast
        );

        console.log(
            "SES Forecast:",
            sesModel.forecast
        );

        const methods = [

            evaluateModel({

                name:
                    "SES",

                actual:
                    testSeries,

                fitted:
                    sesModel.forecast

            }),

            evaluateModel({

                name:
                    "Holt",

                actual:
                    testSeries,

                fitted:
                    holtModel.forecast

            }),

            evaluateModel({

                name:
                    "Holt-Winters",

                actual:
                    testSeries,

                fitted:
                    hwModel.forecast

            })

        ];

        console.log(
            "sesModel:",
            sesModel
        );

        console.log(
            "holtModel:",
            holtModel
        );

        console.log(
            "hwModel:",
            hwModel
        );

        /*
        ==========================
        BEST MODEL
        ==========================
        */

        const bestMethod =

            selectBestModel(
                methods
            );

        const ranking =

            buildRanking(
                methods
            );

        const explanation =

            buildExplanation(

                bestMethod,

                datasetSummary

            );
        const diagnostic =

            buildDiagnostic(

                datasetSummary,

                bestMethod

            );
        const modelOutputs = {

            SES: {

                forecast:

                    SES(
                        fullSeries,
                        horizon
                    ).forecast,

                next_value:

                    SES(
                        fullSeries,
                        horizon
                    ).nextValue

            },

            Holt: {

                forecast:

                    Holt(
                        fullSeries,
                        horizon
                    ).forecast,

                next_value:

                    Holt(
                        fullSeries,
                        horizon
                    ).nextValue

            },

            "Holt-Winters": {

                forecast:

                    HoltWinters(
                        fullSeries,
                        horizon
                    ).forecast,

                next_value:

                    HoltWinters(
                        fullSeries,
                        horizon
                    ).nextValue

            }

        };
        /*
        ==========================
        RETRAIN
        ==========================
        */


        let finalModel;

        switch (

        bestMethod.name

        ) {

            case
                "SES":

                finalModel =

                    SES(

                        fullSeries,

                        horizon

                    );

                break;

            case
                "Holt":

                finalModel =

                    Holt(

                        fullSeries,

                        horizon

                    );

                break;

            default:

                finalModel =

                    HoltWinters(

                        fullSeries,

                        horizon

                    );

        }

        /*
        ==========================
        PREDICTIONS
        ==========================
        */

        const predictions =

            buildPredictions(

                finalModel.forecast

            );

        let weeklyPattern = {

            enabled: false,

            base_method:
                bestMethod.name,

            factors: {}

        };

        let adjustedPredictions =

            predictions;

        if (

            bestMethod.name ===
            "SES"

        ) {

            weeklyPattern =

                buildWeeklyPattern(

                    historicalSeries

                );

            adjustedPredictions =

                applyWeeklyAdjustment(

                    predictions,

                    weeklyPattern

                );

        }

        /*
        ==========================
        RECOMMENDATION
        ==========================
        */

        const recommendation =

            generateRecommendation({

                currentStock:

                    item.current_stock,

                minimumStock:

                    item.minimum_stock,

                predictions

            });

        /*
        ==========================
        TRAIN TEST INFO
        ==========================
        */

        // const trainTest = {

        //     split_ratio:

        //         splitRatio,

        //     train_size:

        //         trainSize,

        //     test_size:

        //         testSize,

        //     train_start:

        //         train[0]?.date,

        //     train_end:

        //         train[
        //             train.length - 1
        //         ]?.date,

        //     test_start:

        //         test[0]?.date,

        //     test_end:

        //         test[
        //             test.length - 1
        //         ]?.date

        // };

        const trainTest = {

            split_ratio:
                splitRatio,

            train_size:
                trainSize,

            test_size:
                testSize,

            train_start:
                train[0]?.date,

            train_end:
                train[
                    train.length - 1
                ]?.date,

            test_start:
                test[0]?.date,

            test_end:
                test[
                    test.length - 1
                ]?.date,

            train_percentage:
                splitRatio,

            test_percentage:
                100 - splitRatio

        };

        /*
        ==========================
        RESPONSE
        ==========================
        */

        return Response.json({

            success:
                true,

            item,

            // analysis_config: {

            //     horizon,

            //     split_ratio:

            //         splitRatio,

            //     methods: [

            //         "SES",

            //         "Holt",

            //         "Holt-Winters"

            //     ]

            // },

            analysis_config: {

                horizon,

                split_ratio:
                    splitRatio,

                season_length:
                    7,

                methods: [

                    "SES",

                    "Holt",

                    "Holt-Winters"

                ]

            },
            dataset_summary:

                datasetSummary,

            historical_series:

                historicalSeries,

            train_test:

                trainTest,

            methods,

            ranking,

            // best_method: {

            //     ...bestMethod,

            //     reason: [

            //         "Lowest MAPE",

            //         "Lowest RMSE",

            //         bestMethod.name ===
            //             "Holt-Winters"

            //             ? "Suitable for seasonal demand"

            //             : "Best forecasting performance"

            //     ]

            // },

            best_method: {

                ...bestMethod,

                reason: [

                    "Lowest MAPE",

                    "Lowest RMSE",

                    datasetSummary.zero_count > 0

                        ?

                        "Robust against intermittent demand"

                        :

                        "Best forecasting performance"

                ]

            },

            explanation,

            diagnostic,

            model_outputs:
                modelOutputs,

            weekly_pattern:

                weeklyPattern,

            predictions,

            adjusted_predictions:

                adjustedPredictions,

            recommendation

        });

    }

    catch (err) {

        return Response.json(

            {

                success: false,

                message:
                    err.message

            },

            {

                status: 500

            }

        );

    }

}