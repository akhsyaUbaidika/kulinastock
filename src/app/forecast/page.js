
"use client";

import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function ForecastPage() {
    const [forecast, setForecast] =
        useState(null);

    const [items, setItems] =
        useState([]);

    const [selectedItem, setSelectedItem] =
        useState("");

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const response =
                await fetch(
                    "/api/items"
                );

            const result =
                await response.json();

            setItems(
                result.data || []
            );

            if (
                result.data?.length
            ) {
                setSelectedItem(
                    result.data[0].id
                );

                await loadForecast(
                    result.data[0].id
                );
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function loadForecast(
        itemId
    ) {
        try {
            const response =
                await fetch(
                    `/api/forecast?item_id=${itemId}&save=true`
                );

            const result =
                await response.json();

            setForecast(
                result
            );
        } catch (err) {
            console.error(err);
        }
    }

    function f(v) {
        return Number(
            v
        ).toFixed(
            2
        );
    }

    function accuracy(
        mape
    ) {
        if (
            mape < 10
        )
            return "Excellent";

        if (
            mape < 20
        )
            return "Good";

        if (
            mape < 50
        )
            return "Reasonable";

        return "Poor";
    }

    const ranking =
        forecast
            ? [
                {
                    method:
                        "SES",

                    forecast:
                        forecast
                            .latestForecast
                            .SES,

                    ...forecast
                        .metrics
                        .SES,
                },

                {
                    method:
                        "Holt",

                    forecast:
                        forecast
                            .latestForecast
                            .Holt,

                    ...forecast
                        .metrics
                        .Holt,
                },

                {
                    method:
                        "Holt-Winters",

                    forecast:
                        forecast
                            .latestForecast
                            .HoltWinters,

                    ...forecast
                        .metrics
                        .HoltWinters,
                },
            ]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a.mape -
                        b.mape
                )
            : [];

    if (!forecast)
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">

                Loading...

            </main>
        );

    const chart =
        forecast.historicalData.map(
            (
                v,
                i
            ) => ({
                period:
                    i + 1,

                historical:
                    v,

                ses:
                    forecast
                        .sesForecast[
                    i
                    ],

                holt:
                    forecast
                        .holtForecast[
                    i
                    ],

                hw:
                    forecast
                        .hwForecast[
                    i
                    ],
            })
        );


    return (
        <main className="min-h-screen bg-slate-100 text-slate-900">

            <div className="max-w-7xl mx-auto px-8 py-10">

                <div className="mb-10">

                    <h1 className="text-6xl font-bold tracking-tight">

                        Forecast Analysis

                    </h1>

                    <p className="mt-3 text-lg text-slate-600">

                        Inventory forecasting using Exponential Smoothing.

                    </p>

                </div>


                <div
                    className="
bg-white
rounded-3xl
border
border-slate-200
shadow-sm
p-8
mb-8
"
                >

                    <h2
                        className="
text-2xl
font-semibold
mb-6
"
                    >

                        Generate Forecast

                    </h2>

                    <div className="flex gap-4">

                        <select
                            value={selectedItem}
                            onChange={(e) =>
                                setSelectedItem(
                                    e.target.value
                                )
                            }
                            className="
h-14
w-[260px]
px-5
rounded-xl
border
border-slate-300
bg-white
text-slate-900
outline-none
focus:ring-2
focus:ring-blue-500
"
                        >

                            {
                                items.map(
                                    item =>

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {
                                                item.item_name
                                            }

                                        </option>

                                )
                            }

                        </select>

                        <button
                            onClick={() =>
                                loadForecast(
                                    selectedItem
                                )
                            }
                            className="
h-14
px-8
rounded-xl
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
transition
shadow-sm
"
                        >

                            Generate

                        </button>

                    </div>

                </div>


                <div
                    className="
grid
grid-cols-12
gap-8
mb-8
"
                >

                    <div
                        className="
col-span-12
xl:col-span-8
bg-white
rounded-3xl
border
border-slate-200
shadow-sm
p-8
"
                    >

                        <div className="mb-6">

                            <h2 className="text-2xl font-bold">

                                Forecast Trend

                            </h2>

                            <p className="text-slate-500">

                                Historical vs Forecast

                            </p>

                        </div>

                        <div className="h-[360px]">

                            <ResponsiveContainer>

                                <LineChart
                                    data={chart}
                                >

                                    <CartesianGrid
                                        stroke="#E2E8F0"
                                    />

                                    <XAxis
                                        dataKey="period"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Line
                                        dataKey="historical"
                                        stroke="#64748B"
                                        strokeWidth={3}
                                    />

                                    <Line
                                        dataKey="holt"
                                        stroke="#2563EB"
                                    />

                                    <Line
                                        dataKey="hw"
                                        stroke="#16A34A"
                                    />

                                    <Line
                                        dataKey="ses"
                                        stroke="#EA580C"
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    <div
                        className="
col-span-12
xl:col-span-4
space-y-5
"
                    >

                        <div
                            className="
rounded-3xl
bg-gradient-to-br
from-blue-600
to-indigo-700
text-white
p-8
shadow-lg
"
                        >

                            <p
                                className="
uppercase
tracking-wider
text-sm
opacity-80
"
                            >

                                Recommended

                            </p>

                            <h2
                                className="
text-5xl
font-bold
mt-3
"
                            >

                                {
                                    forecast.bestMethod.method
                                }

                            </h2>

                            <p className="mt-4 opacity-90">

                                Lowest MAPE

                            </p>

                        </div>


                        <div
                            className="
grid
grid-cols-2
gap-4
"
                        >

                            {[
                                [
                                    "Forecast",
                                    f(
                                        forecast.forecastValue
                                    )
                                ],

                                [
                                    "MAE",
                                    f(
                                        forecast.bestMethod.mae
                                    )
                                ],

                                [
                                    "MAPE",
                                    `${f(
                                        forecast.bestMethod.mape
                                    )}%`
                                ],

                                [
                                    "Accuracy",
                                    accuracy(
                                        forecast.bestMethod.mape
                                    )
                                ]

                            ].map(
                                m =>

                                    <div
                                        key={m[0]}
                                        className="
bg-white
border
border-slate-200
rounded-2xl
p-5
shadow-sm
"
                                    >

                                        <p
                                            className="
text-sm
font-medium
text-slate-500
"
                                        >

                                            {
                                                m[0]
                                            }

                                        </p>

                                        <p
                                            className="
mt-3
text-xl
font-bold
text-slate-900
"
                                        >

                                            {
                                                m[1]
                                            }

                                        </p>

                                    </div>

                            )}

                        </div>

                    </div>

                </div>


                <div
                    className="
bg-white
rounded-3xl
border
border-slate-200
shadow-sm
p-8
"
                >

                    <div className="mb-8">

                        <h2 className="text-2xl font-bold">

                            Compare Methods

                        </h2>

                        <p className="text-slate-500">

                            Ranked by MAPE

                        </p>

                    </div>


                    <div
                        className="
grid
md:grid-cols-3
gap-6
"
                    >

                        {
                            ranking.map(
                                (
                                    item,
                                    i
                                ) =>

                                    <div
                                        key={
                                            item.method
                                        }
                                        className="
bg-slate-50
border
border-slate-200
rounded-3xl
p-6
hover:-translate-y-1
hover:shadow-lg
transition
"
                                    >

                                        <div
                                            className="
text-3xl
mb-5
"
                                        >

                                            {
                                                [
                                                    "🥇",
                                                    "🥈",
                                                    "🥉"
                                                ][i]
                                            }

                                        </div>

                                        <h3
                                            className="
text-2xl
font-bold
text-slate-900
"
                                        >

                                            {
                                                item.method
                                            }

                                        </h3>

                                        <div className="mt-6">

                                            <p className="text-slate-500">

                                                MAPE

                                            </p>

                                            <p
                                                className="
text-5xl
font-bold
text-blue-700
"
                                            >

                                                {
                                                    f(
                                                        item.mape
                                                    )
                                                }

                                                %

                                            </p>

                                        </div>

                                        <hr className="my-6" />

                                        <div>

                                            <p className="text-slate-500">

                                                Forecast

                                            </p>

                                            <p
                                                className="
text-3xl
font-bold
text-slate-900
"
                                            >

                                                {
                                                    f(
                                                        item.forecast
                                                    )
                                                }

                                            </p>

                                        </div>

                                    </div>

                            )
                        }

                    </div>

                </div>

            </div>

        </main>
    );

}