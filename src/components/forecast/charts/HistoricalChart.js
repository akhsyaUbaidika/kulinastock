"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

export default function HistoricalChart({
    data
}) {

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
                    Historical Analysis
                </p>

                <h2
                    className="
text-3xl
font-bold
text-[#0B132B]
"
                >
                    Demand History
                </h2>

            </div>

            <div className="h-[400px]">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={data}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            minTickGap={50}
                        />

                        <YAxis />

                        <Tooltip
                            formatter={(value) => [
                                `${value} unit`,
                                "Demand"
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="demand"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}