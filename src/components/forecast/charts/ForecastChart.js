"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function ForecastChart({
    historical,
    predictions,
    adjusted
}) {

    const historicalData =
        historical.map(row => ({
            date: row.date,
            historical: row.demand
        }));

    const lastHistorical =
        historical[
        historical.length - 1
        ];

    const predictionData = [

        {
            date:
                lastHistorical.date,

            forecast:
                lastHistorical.demand
        },

        ...predictions.map(
            row => ({
                date: row.date,
                forecast: row.qty
            })
        )

    ];

    const adjustedData = [

        {
            date:
                lastHistorical.date,

            adjusted:
                lastHistorical.demand
        },

        ...adjusted.map(
            row => ({
                date: row.date,
                adjusted: row.qty
            })
        )

    ];
    const mergedData = [

        ...historicalData,

        ...predictionData,

        ...adjustedData

    ].reduce((acc, curr) => {

        const existing =
            acc.find(
                row =>
                    row.date
                    === curr.date
            );

        if (existing) {

            Object.assign(
                existing,
                curr
            );

        } else {

            acc.push(curr);

        }

        return acc;

    }, []);

    return (

        <div
            className="
bg-white
rounded-[32px]
border
border-slate-200
shadow-sm
p-8
mb-8
"
        >

            <div className="mb-8">

                <p
                    className="
uppercase
tracking-[0.25em]
text-blue-600
text-xs
font-semibold
mb-2
"
                >
                    Forecast Visualization
                </p>

                <h2
                    className="
text-3xl
font-bold
text-[#0B132B]
"
                >
                    Forecast vs Adjustment
                </h2>

            </div>

            <div className="h-[450px]">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={mergedData}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="date"
                            minTickGap={50}
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="historical"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                            name="Historical"
                        />

                        <Line
                            type="linear"
                            dataKey="forecast"
                            stroke="#16a34a"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            name="Forecast"
                            dot={{ r: 5 }}
                        />

                        <Line
                            type="linear"
                            dataKey="adjusted"
                            stroke="#ea580c"
                            strokeWidth={3}
                            name="Adjusted"
                            dot={{ r: 5 }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}