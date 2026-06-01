import { SES } from "@/lib/forecasting/ses";
import { Holt } from "@/lib/forecasting/holt";
import { HoltWinters } from "@/lib/forecasting/holtWinters";

import { MAE, MAPE, RMSE } from "@/lib/forecasting/metrics";

import { supabase } from "@/lib/supabase";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const itemId = searchParams.get("item_id");

        if (!itemId) {
            return Response.json(
                {
                    success: false,
                    message: "item_id is required",
                },
                { status: 400 }
            );
        }

        const { data: history, error } = await supabase
            .from("stock_history")
            .select("*")
            .eq("item_id", itemId)
            .order("period", { ascending: true });

        if (error) {
            return Response.json({
                success: false,
                error,
            });
        }

        const historicalData = history.map(
            (row) => row.stock_used
        );

        if (historicalData.length < 7) {
            return Response.json({
                success: false,
                message: "Minimum 7 historical records required",
            });
        }

        const sesForecast = SES(historicalData);

        const holtForecast = Holt(historicalData);

        const hwForecast = HoltWinters(historicalData);

        const sesMetrics = {
            mae: MAE(historicalData, sesForecast),
            mape: MAPE(historicalData, sesForecast),
            rmse: RMSE(historicalData, sesForecast),
        };

        const holtMetrics = {
            mae: MAE(historicalData, holtForecast),
            mape: MAPE(historicalData, holtForecast),
            rmse: RMSE(historicalData, holtForecast),
        };

        const hwMetrics = {
            mae: MAE(historicalData, hwForecast),
            mape: MAPE(historicalData, hwForecast),
            rmse: RMSE(historicalData, hwForecast),
        };

        const methods = [
            {
                method: "SES",
                ...sesMetrics,
            },
            {
                method: "Holt",
                ...holtMetrics,
            },
            {
                method: "Holt-Winters",
                ...hwMetrics,
            },
        ];

        methods.sort((a, b) => a.mape - b.mape);

        const bestMethod = methods[0];

        let forecastValue = 0;

        if (bestMethod.method === "SES") {
            forecastValue =
                sesForecast[sesForecast.length - 1];
        }

        if (bestMethod.method === "Holt") {
            forecastValue =
                holtForecast[holtForecast.length - 1];
        }

        if (bestMethod.method === "Holt-Winters") {
            forecastValue =
                hwForecast[hwForecast.length - 1];
        }

        const shouldSave =
            searchParams.get("save");

        if (shouldSave === "true") {
            await supabase
                .from("forecast_results")
                .insert([
                    {
                        item_id:
                            parseInt(itemId),

                        method:
                            bestMethod.method,

                        forecast_value:
                            forecastValue,

                        mae:
                            bestMethod.mae,

                        mape:
                            bestMethod.mape,

                        rmse:
                            bestMethod.rmse,
                    },
                ]);
        }

        return Response.json({
            success: true,

            item_id: itemId,

            historicalData,

            sesForecast,
            holtForecast,
            hwForecast,

            metrics: {
                SES: sesMetrics,
                Holt: holtMetrics,
                HoltWinters: hwMetrics,
            },

            bestMethod,

            forecastValue,

            latestForecast: {
                SES:
                    sesForecast[
                    sesForecast.length - 1
                    ],

                Holt:
                    holtForecast[
                    holtForecast.length - 1
                    ],

                HoltWinters:
                    hwForecast[
                    hwForecast.length - 1
                    ],
            },
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}