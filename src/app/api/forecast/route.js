import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function mean(arr) {
    return arr.length
        ? arr.reduce((a, b) => a + b, 0) /
        arr.length
        : 0;
}

function MAE(a, f) {
    return (
        a.reduce(
            (s, v, i) =>
                s +
                Math.abs(
                    v -
                    f[i]
                ),
            0
        ) /
        a.length
    );
}

function MAPE(a, f) {

    let total = 0;

    a.forEach(
        (
            v,
            i
        ) => {

            if (v !== 0) {

                total +=
                    Math.abs(
                        (
                            v -
                            f[i]
                        ) /
                        v
                    );

            }

        }
    );

    return (
        total /
        a.length
    ) *
        100;

}

function RMSE(a, f) {

    return Math.sqrt(

        a.reduce(

            (
                s,
                v,
                i
            ) =>

                s +

                Math.pow(
                    v -
                    f[i],
                    2
                ),

            0

        ) /

        a.length

    );

}

function SES(
    data,
    alpha = 0.3
) {

    let out = [
        data[0]
    ];

    for (
        let i = 1;
        i <
        data.length;
        i++
    ) {

        out.push(

            alpha *
            data[
            i - 1
            ] +

            (
                1 -
                alpha
            ) *

            out[
            i - 1
            ]

        );

    }

    return out;

}

function HOLT(
    data
) {

    let level =
        data[0];

    let trend =
        data[1] -
        data[0];

    const out =
        [];

    for (
        let i = 1;
        i <
        data.length;
        i++
    ) {

        const prev =
            level;

        level =
            0.3 *
            data[
            i
            ] +

            0.7 *
            (
                level +
                trend
            );

        trend =
            0.2 *
            (
                level -
                prev
            ) +

            0.8 *
            trend;

        out.push(
            level +
            trend
        );

    }

    return out;

}

function HOLT_WINTERS(data) {

    const avg = mean(data);

    return data.map((v, i) => {

        const weekday = i % 7;

        let season = 1;

        if (weekday === 4)
            season = 1.10;

        if (weekday === 5)
            season = 1.30;

        if (weekday === 6)
            season = 1.45;

        if (weekday === 0)
            season = 0.85;

        return (
            (
                v +
                avg
            ) /
            2
        ) * season;

    });

}

// function future(
//     arr,
//     days
// ) {

//     const avg =
//         mean(
//             arr.slice(
//                 -7
//             )
//         );

//     return Array
//         .from(
//             {
//                 length:
//                     days
//             }
//         )
//         .map(
//             (
//                 _,
//                 i
//             ) => ({

//                 day:
//                     `D+${i + 1
//                     }`,

//                 value:
//                     Math.max(
//                         0,
//                         Math.round(
//                             avg
//                         )
//                     ),

//             })
//         );

// }

function generateForecast(
    history,
    days
) {

    const base =
        mean(
            history.slice(
                -14
            )
        );

    const result =
        [];

    const today =
        new Date();

    for (
        let i = 1;
        i <= days;
        i++
    ) {

        const date =
            new Date(
                today
            );

        date.setDate(
            today.getDate()
            + i
        );

        const wd =
            date.getDay();

        let factor =
            1;

        if (
            wd === 5
        )
            factor = 1.20;

        if (
            wd === 6
        )
            factor = 1.40;

        if (
            wd === 0
        )
            factor = 1.55;

        if (
            wd === 1
        )
            factor = 0.85;

        if (
            wd >= 2 &&
            wd <= 4
        )
            factor =
                0.95;

        result.push({

            day:
                `D+${i}`,

            value:
                Math.max(
                    0,

                    Math.round(
                        base *
                        factor
                    )

                ),

        });

    }

    return result;

}
export async function GET(
    req
) {

    try {

        const {
            searchParams
        } =
            new URL(
                req.url
            );

        const itemId =
            searchParams.get(
                "item_id"
            );

        const days =
            Number(
                searchParams.get(
                    "days"
                ) ||
                3
            );

        const startDate =
            searchParams.get(
                "start_date"
            );

        if (
            !itemId
        ) {

            return NextResponse.json(
                {
                    success:
                        false
                },
                {
                    status:
                        400
                }
            );

        }

        const {
            data:
            item
        } =
            await supabase
                .from(
                    "items"
                )
                .select(
                    "*"
                )
                .eq(
                    "id",
                    itemId
                )
                .single();

        let query =
            supabase
                .from(
                    "stock_transactions"
                )
                .select(
                    `
                    qty,
                    transaction_date,
                    transaction_type
                    `
                )
                .eq(
                    "item_id",
                    itemId
                )
                .eq(
                    "transaction_type",
                    "OUT"
                )
                .order(
                    "transaction_date"
                );

        if (
            startDate
        ) {

            query =
                query.gte(
                    "transaction_date",
                    startDate
                );

        }

        const {
            data:
            trx
        } =
            await query;

        if (
            !trx ||
            trx.length <
            7
        ) {

            return NextResponse.json(
                {
                    success:
                        false,
                    message:
                        "Minimal historis 7 hari"
                },
                {
                    status:
                        400
                }
            );

        }

        const actual =
            trx.map(
                v =>
                    Number(
                        v.qty
                    )
            );

        const ses =
            SES(
                actual
            );

        const holt =
            HOLT(
                actual
            );

        const hw =
            HOLT_WINTERS(
                actual
            );

        const methods = [

            {
                name:
                    "SES",
                forecast:
                    generateForecast(
                        ses,
                        days
                    ),
                mae:
                    MAE(
                        actual,
                        ses
                    ),
                mape:
                    MAPE(
                        actual,
                        ses
                    ),
                rmse:
                    RMSE(
                        actual,
                        ses
                    ),
            },

            {
                name:
                    "Holt",
                forecast:
                    generateForecast(
                        holt,
                        days
                    ),
                mae:
                    MAE(
                        actual.slice(
                            1
                        ),
                        holt
                    ),
                mape:
                    MAPE(
                        actual.slice(
                            1
                        ),
                        holt
                    ),
                rmse:
                    RMSE(
                        actual.slice(
                            1
                        ),
                        holt
                    ),
            },

            {
                name:
                    "HoltWinters",
                forecast:
                    generateForecast(
                        hw,
                        days
                    ),
                mae:
                    MAE(
                        actual,
                        hw
                    ),
                mape:
                    MAPE(
                        actual,
                        hw
                    ),
                rmse:
                    RMSE(
                        actual,
                        hw
                    ),
            },

        ];

        methods.sort(
            (
                a,
                b
            ) =>
                a.mae -
                b.mae
        );

        const best =
            methods[0];

        const prediction =
            best
                .forecast
                .reduce(
                    (
                        s,
                        v
                    ) =>
                        s +
                        v.value,
                    0
                );

        const safety =
            Math.ceil(
                prediction *
                0.1
            );

        const restock =
            prediction +
            safety;

        const remain =
            Math.max(
                0,
                (
                    item.current_stock ||
                    0
                ) -
                prediction
            );

        return NextResponse.json({

            success:
                true,

            data: {

                item_name:
                    item.item_name,

                current_stock:
                    item.current_stock,

                historical_records:
                    actual.length,

                prediction_days:
                    days,

                historical:

                    trx.map(
                        (
                            v
                        ) => ({

                            date:
                                v.transaction_date,

                            qty:
                                Number(
                                    v.qty
                                )

                        })
                    ),

                forecast_result:
                    best.forecast,

                methods,

                best_method:
                    best.name,

                safety_stock:
                    safety,

                restock,

                remaining_stock:
                    remain,

                status:
                    remain <=
                        safety
                        ? "LOW"
                        : "SAFE",

            },

        });

    }

    catch (
    e
    ) {

        return NextResponse.json(

            {

                success:
                    false,

                message:
                    e.message,

            },

            {

                status:
                    500,

            }

        );

    }

}