"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function ReportsPage() {

    const [loading, setLoading] =
        useState(true);

    const [exporting, setExporting] =
        useState(false);

    const [items, setItems] =
        useState([]);

    const [history, setHistory] =
        useState([]);

    const [forecast, setForecast] =
        useState([]);

    useEffect(
        () => {
            load();
        },
        []
    );

    async function load() {

        try {

            setLoading(true);

            const [

                itemsRes,
                historyRes,

            ] = await Promise.all([

                fetch("/api/items"),

                fetch("/api/history"),

            ]);

            const itemsJson =
                await itemsRes.json();

            const historyJson =
                await historyRes.json();

            const itemData =
                itemsJson.data
                ||
                [];

            setItems(
                itemData
            );

            setHistory(
                historyJson.data
                ||
                []
            );

            const forecasts =

                await Promise.all(

                    itemData.map(

                        async (
                            item
                        ) => {

                            try {

                                const r =
                                    await fetch(
                                        `/api/forecast?item_id=${item.id}&days=7`
                                    );

                                const j =
                                    await r.json();

                                if (
                                    j.success
                                ) {

                                    return j.data;

                                }

                                return null;

                            }

                            catch {

                                return null;

                            }

                        }

                    )

                );

            setForecast(

                forecasts.filter(
                    Boolean
                )

            );

        }

        finally {

            setLoading(
                false
            );

        }

    }

    async function exportExcel() {

        try {

            setExporting(
                true
            );

            const res =
                await fetch(
                    "/api/reports/export"
                );

            if (
                !res.ok
            ) {

                throw new Error();

            }

            const blob =
                await res.blob();

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const a =
                document.createElement(
                    "a"
                );

            a.href =
                url;

            a.download =
                `kulinastock-report-${Date.now()}.xlsx`;

            document.body.appendChild(
                a
            );

            a.click();

            a.remove();

            window.URL
                .revokeObjectURL(
                    url
                );

        }

        catch {

            alert(
                "Export failed"
            );

        }

        finally {

            setExporting(
                false
            );

        }

    }
    const summary =
        useMemo(() => {

            const totalStock =
                items.reduce(
                    (a, b) =>
                        a +
                        (
                            Number(
                                b.stock
                            )
                            ||
                            0
                        ),
                    0
                );

            const movementIn =
                history
                    .filter(
                        v =>
                            (
                                v.transaction_type
                                ||
                                v.type
                            )
                            ===
                            "IN"
                    )
                    .reduce(
                        (a, b) =>
                            a +
                            (
                                Number(
                                    b.qty
                                )
                                ||
                                0
                            ),
                        0
                    );

            const movementOut =
                history
                    .filter(
                        v =>
                            (
                                v.transaction_type
                                ||
                                v.type
                            )
                            ===
                            "OUT"
                    )
                    .reduce(
                        (a, b) =>
                            a +
                            (
                                Number(
                                    b.qty
                                )
                                ||
                                0
                            ),
                        0
                    );

            const lowStock =

                items.filter(
                    v =>

                        (
                            Number(
                                v.stock
                            )
                            ||
                            0

                        )

                        <=

                        (
                            Number(
                                v.minimum_stock
                            )
                            ||
                            20
                        )

                );

            return {

                totalItem:
                    items.length,

                totalStock,

                movementIn,

                movementOut,

                lowStock,

                forecastCount:
                    forecast.length,

            };

        },
            [
                items,
                history,
                forecast
            ]
        );

    const stockChart =
        useMemo(

            () => {

                return items
                    .slice(
                        0,
                        10
                    )
                    .map(
                        v => ({

                            item:
                                v.item_name,

                            stock:
                                Number(
                                    v.stock
                                )
                                ||
                                0,

                            minimum:
                                Number(
                                    v.minimum_stock
                                )
                                ||
                                20,

                        })

                    );

            },

            [
                items
            ]

        );

    const accuracyChart =
        useMemo(

            () => {

                return forecast
                    .map(
                        v => {

                            const method =

                                v.methods?.find(
                                    x =>
                                        x.name
                                        ===
                                        v.best_method
                                );

                            return {

                                item:
                                    v.item_name,

                                mape:
                                    Number(
                                        method?.mape
                                    )
                                    ||
                                    0,

                            };

                        }

                    );

            },

            [
                forecast
            ]

        );

    const forecastRows =
        useMemo(

            () => {

                return forecast
                    .map(
                        v => {

                            const best =

                                v.methods?.find(
                                    m =>
                                        m.name
                                        ===
                                        v.best_method
                                );

                            return {

                                item:
                                    v.item_name,

                                method:
                                    v.best_method,

                                forecast:

                                    v.forecast_result
                                        ?.reduce(
                                            (
                                                a,
                                                b
                                            ) =>

                                                a +

                                                (
                                                    Number(
                                                        b.value
                                                    )
                                                    ||
                                                    0
                                                ),

                                            0
                                        )

                                    ||
                                    0,

                                mape:
                                    best?.mape
                                    ||
                                    0,

                                mae:
                                    best?.mae
                                    ||
                                    0,

                                rmse:
                                    best?.rmse
                                    ||
                                    0,

                                restock:
                                    v.restock
                                    ||
                                    0,

                            };

                        }

                    );

            },

            [
                forecast
            ]

        );

    const priority =
        useMemo(

            () => {

                return forecast

                    .slice()

                    .sort(
                        (
                            a,
                            b
                        ) =>

                            (
                                b.restock
                                ||
                                0
                            )

                            -

                            (
                                a.restock
                                ||
                                0
                            )

                    )

                    .slice(
                        0,
                        5
                    );

            },

            [
                forecast
            ]

        );

    const bestMethod =
        useMemo(

            () => {

                const counter =
                    {};

                forecast.forEach(
                    v => {

                        counter[
                            v.best_method
                        ] =

                            (
                                counter[
                                v.best_method
                                ]

                                ||
                                0
                            )

                            +

                            1;

                    }
                );

                return Object
                    .entries(
                        counter
                    )

                    .sort(
                        (
                            a,
                            b
                        ) =>

                            b[1]
                            -
                            a[1]

                    )

                    ?.[0]

                    ?.[0]

                    ||

                    "-";

            },

            [
                forecast
            ]

        );

    const averageMape =
        useMemo(

            () => {

                if (
                    !forecast.length
                )
                    return 0;

                let total = 0;
                let count = 0;

                forecast.forEach(
                    v => {

                        const m =

                            v.methods?.find(
                                x =>
                                    x.name
                                    ===
                                    v.best_method
                            );

                        if (
                            m
                        ) {

                            total +=
                                Number(
                                    m.mape
                                );

                            count++;

                        }

                    }

                );

                return count
                    ?

                    (
                        total
                        /
                        count
                    )

                    : 0;

            },

            [
                forecast
            ]

        );

    const recentActivity =
        useMemo(

            () => {

                return history
                    .slice(
                        0,
                        10
                    );

            },

            [
                history
            ]

        );

    if (
        loading
    ) {

        return (

            <main
                className="
px-8
py-8
"
            >

                <div
                    className="
max-w-[1180px]
mx-auto
"
                >

                    Loading report...

                </div>

            </main>

        );

    }

    return (

        <main
            className="
px-8
py-8
"
        >

            <div
                className="
max-w-[1180px]
mx-auto
"
            >

                <section
                    className="
rounded-[36px]
bg-[#F5F7F4]
px-12
py-12
mb-8
flex
justify-between
items-end
"
                >

                    <div>

                        <p
                            className="
uppercase
tracking-[0.4em]
text-green-700
text-xs
mb-3
"
                        >

                            Reports

                        </p>

                        <h1
                            className="
text-[72px]
font-bold
leading-none
"
                        >

                            Inventory Report

                        </h1>

                        <p
                            className="
text-slate-500
mt-5
"
                        >

                            Realtime operational and forecasting summary.

                        </p>

                    </div>

                    {/* <div
                        className="
flex
gap-4
items-end
"
                    >

                        <div
                            className="
text-right
"
                        >

                            <div
                                className="
text-sm
text-slate-400
"
                            >

                                Best Forecast

                            </div>

                            <div
                                className="
text-4xl
font-bold
"
                            >

                                {
                                    bestMethod
                                }

                            </div>

                        </div>

                        <button

                            onClick={
                                exportExcel
                            }

                            disabled={
                                exporting
                            }

                            className="
h-14
px-8
rounded-[20px]
bg-blue-600
text-white
font-semibold
"

                        >

                            {

                                exporting

                                    ?

                                    "Exporting..."

                                    :

                                    "Export Excel"

                            }

                        </button>

                    </div> */}

                </section>

                <section
                    className="
grid
grid-cols-6
gap-5
mb-8
"
                >

                    <Card
                        title="Items"
                        value={
                            summary
                                .totalItem
                        }
                    />

                    <Card
                        title="Stock"
                        value={
                            summary
                                .totalStock
                        }
                    />

                    <Card
                        title="IN"
                        value={
                            summary
                                .movementIn
                        }
                    />

                    <Card
                        title="OUT"
                        value={
                            summary
                                .movementOut
                        }
                    />

                    <Card
                        title="Low"
                        value={
                            summary
                                .lowStock
                                .length
                        }
                    />

                    <Card
                        title="Forecast"
                        value={
                            summary
                                .forecastCount
                        }
                    />

                </section>
                <section
                    className="
grid
grid-cols-2
gap-6
mb-8
"
                >

                    <div
                        className="
bg-white
rounded-[28px]
p-8
"
                    >

                        <p
                            className="
text-slate-500
mb-2
"
                        >

                            Best Forecast

                        </p>

                        <div
                            className="
text-[42px]
font-bold
"
                        >

                            {
                                bestMethod
                            }

                        </div>

                    </div>

                    <div
                        className="
bg-white
rounded-[28px]
p-8
flex
items-center
justify-between
"
                    >

                        <div>

                            <p
                                className="
text-slate-500
"
                            >

                                Export Report

                            </p>

                            <p
                                className="
text-slate-700
"
                            >

                                Current dataset

                            </p>

                        </div>

                        <button
                            onClick={exportExcel}
                            className="
px-8
h-14
bg-blue-600
text-white
rounded-[18px]
font-semibold
"
                        >

                            Export Excel

                        </button>

                    </div>

                </section>

                <section
                    className="
grid
grid-cols-2
gap-6
mb-8
"
                >

                    <div
                        className="
bg-white
rounded-[32px]
p-8
"
                    >

                        <h3
                            className="
text-2xl
font-bold
mb-8
"
                        >

                            Inventory Distribution

                        </h3>

                        <div
                            className="
h-[320px] min-w-0
"
                        >

                            <ResponsiveContainer>

                                <BarChart
                                    data={
                                        stockChart
                                    }
                                >

                                    <CartesianGrid />

                                    <XAxis
                                        dataKey="item"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="stock"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                    <div
                        className="
bg-white
rounded-[32px]
p-8
"
                    >

                        <h3
                            className="
text-2xl
font-bold
mb-8
"
                        >

                            Forecast Accuracy

                        </h3>

                        <div
                            className="
h-[320px] min-w-0
"
                        >

                            <ResponsiveContainer>

                                <LineChart
                                    data={
                                        accuracyChart
                                    }
                                >

                                    <CartesianGrid />

                                    <XAxis
                                        dataKey="item"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Line
                                        dataKey="mape"
                                        stroke="#2563EB"
                                        strokeWidth={
                                            3
                                        }
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                        <div
                            className="
mt-6
text-sm
text-slate-500
"
                        >

                            Average MAPE

                            <b>

                                {" "}

                                {
                                    averageMape
                                        .toFixed(
                                            2
                                        )
                                }

                                %

                            </b>

                        </div>

                    </div>

                </section>

                <section
                    className="
grid
grid-cols-2
gap-6
mb-8
"
                >

                    <div
                        className="
bg-white
rounded-[32px]
p-8
"
                    >

                        <h3
                            className="
text-2xl
font-bold
mb-8
"
                        >

                            Forecast Summary

                        </h3>

                        <div
                            className="
overflow-auto
"
                        >

                            <div
                                className="
space-y-3
"
                            >

                                {

                                    forecastRows.map(
                                        v => (

                                            <div
                                                key={v.item}
                                                className="
grid
grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr]
gap-4
rounded-[20px]
bg-slate-50
p-5
items-center
"
                                            >

                                                <div>

                                                    <div
                                                        className="
font-semibold
"
                                                    >

                                                        {v.item}

                                                    </div>

                                                    <div
                                                        className="
text-sm
text-slate-600
"
                                                    >

                                                        {v.method}

                                                    </div>

                                                </div>

                                                <div>

                                                    <div
                                                        className="
text-xs
text-slate-500
"
                                                    >

                                                        Forecast

                                                    </div>

                                                    <div
                                                        className="
font-bold
"
                                                    >

                                                        {v.forecast}

                                                    </div>

                                                </div>

                                                <div>

                                                    <div
                                                        className="
text-xs
text-slate-500
"
                                                    >

                                                        MAPE

                                                    </div>

                                                    <div>

                                                        {
                                                            Number(
                                                                v.mape
                                                            )
                                                                .toFixed(2)
                                                        }%

                                                    </div>

                                                </div>

                                                <div>

                                                    <div
                                                        className="
text-xs
text-slate-500
"
                                                    >

                                                        MAE

                                                    </div>

                                                    <div>

                                                        {
                                                            Number(
                                                                v.mae
                                                            )
                                                                .toFixed(2)
                                                        }

                                                    </div>

                                                </div>

                                                <div>

                                                    <div
                                                        className="
text-xs
text-slate-500
"
                                                    >

                                                        RMSE

                                                    </div>

                                                    <div>

                                                        {
                                                            Number(
                                                                v.rmse
                                                            )
                                                                .toFixed(2)
                                                        }

                                                    </div>

                                                </div>

                                                <div>

                                                    <div
                                                        className="
text-xs
text-slate-500
"
                                                    >

                                                        Restock

                                                    </div>

                                                    <div
                                                        className="
font-bold
text-blue-600
"
                                                    >

                                                        {v.restock}

                                                    </div>

                                                </div>

                                            </div>

                                        )

                                    )

                                }

                            </div>

                        </div>

                    </div>

                    <div
                        className="
bg-white
rounded-[32px]
p-8
"
                    >

                        <h3
                            className="
text-2xl
font-bold
mb-8
"
                        >

                            Restock Priority

                        </h3>

                        <div
                            className="
space-y-4
"
                        >

                            {

                                priority.map(
                                    v =>

                                        <div
                                            key={
                                                v.item_name
                                            }
                                            className="
rounded-[20px]
bg-slate-50
p-5
"
                                        >

                                            <div
                                                className="
font-semibold
mb-2
"
                                            >

                                                {
                                                    v.item_name
                                                }

                                            </div>

                                            <div>

                                                Current

                                                {

                                                    v.current_stock

                                                }

                                            </div>

                                            <div>

                                                Restock

                                                {

                                                    v.restock

                                                }

                                            </div>

                                        </div>

                                )

                            }

                        </div>

                    </div>

                </section>

                <section
                    className="
grid
grid-cols-2
gap-6
mb-8
"
                >

                    <div
                        className="
bg-white
rounded-[32px]
p-8
"
                    >

                        <h3
                            className="
text-2xl
font-bold
mb-8
"
                        >

                            Low Stock Alert

                        </h3>

                        <div
                            className="
space-y-4
"
                        >

                            {

                                summary
                                    .lowStock
                                    .map(
                                        v =>

                                            <div
                                                key={
                                                    v.id
                                                }
                                                className="
flex
justify-between
rounded-[20px]
bg-slate-50
p-5
"
                                            >

                                                <div>

                                                    <div
                                                        className="
font-semibold
"
                                                    >

                                                        {
                                                            v.item_name
                                                        }

                                                    </div>

                                                    <div
                                                        className="
text-slate-500
"
                                                    >

                                                        Min

                                                        {
                                                            v.minimum_stock
                                                            ||
                                                            20
                                                        }

                                                    </div>

                                                </div>

                                                <div
                                                    className="
text-red-600
text-3xl
font-bold
"
                                                >

                                                    {
                                                        v.stock
                                                    }

                                                </div>

                                            </div>

                                    )

                            }

                        </div>

                    </div>

                    <div
                        className="
bg-white
rounded-[32px]
p-8
"
                    >

                        <h3
                            className="
text-2xl
font-bold
mb-8
"
                        >

                            Recent Activity

                        </h3>

                        <div
                            className="
space-y-4
"
                        >

                            {

                                recentActivity.map(
                                    v => (

                                        <div
                                            key={v.id}
                                            className="
bg-slate-50
rounded-[20px]
p-5
flex
justify-between
items-center
"
                                        >

                                            <div>

                                                <div
                                                    className="
font-semibold
mb-1
"
                                                >

                                                    {

                                                        v.items
                                                            ?.item_name

                                                        ||

                                                        "-"

                                                    }

                                                </div>

                                                <div
                                                    className="
text-sm
text-slate-600
"
                                                >

                                                    {

                                                        v.transaction_date

                                                    }

                                                </div>

                                            </div>

                                            <div
                                                className="
text-right
"
                                            >

                                                <div
                                                    className={

                                                        `

inline-flex
px-3
py-1
rounded-full
text-xs
font-semibold

${v.transaction_type === "IN"

                                                            ?

                                                            "bg-green-100 text-green-700"

                                                            :

                                                            "bg-red-100 text-red-700"

                                                        }

`

                                                    }
                                                >

                                                    {

                                                        v.transaction_type

                                                    }

                                                </div>

                                                <div
                                                    className="
mt-2
text-[22px]
font-bold
"
                                                >

                                                    {

                                                        v.qty

                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    )

                                )

                            }

                        </div>

                    </div>

                </section>

                <section
                    className="
rounded-[32px]
bg-gradient-to-br
from-blue-600
to-indigo-700
text-white
p-10
mb-8
"
                >

                    <div
                        className="
uppercase
opacity-70
mb-5
"
                    >

                        Conclusion

                    </div>

                    <div
                        className="
text-[54px]
font-bold
mb-8
"
                    >

                        {
                            bestMethod
                        }

                    </div>

                    <div
                        className="
grid
grid-cols-4
gap-5
"
                    >

                        <div
                            className="
bg-white/10
rounded-[24px]
p-6
"
                        >

                            <div
                                className="
text-white/70
mb-2
"
                            >

                                Average MAPE

                            </div>

                            <div
                                className="
text-[42px]
font-bold
"
                            >

                                {
                                    averageMape
                                        .toFixed(
                                            1
                                        )
                                }

                                %

                            </div>

                        </div>

                        <div
                            className="
bg-white/10
rounded-[24px]
p-6
"
                        >

                            <div
                                className="
text-white/70
mb-2
"
                            >

                                Low Stock

                            </div>

                            <div
                                className="
text-[42px]
font-bold
"
                            >

                                {
                                    summary
                                        .lowStock
                                        .length
                                }

                            </div>

                        </div>

                        <div
                            className="
bg-white/10
rounded-[24px]
p-6
"
                        >

                            <div
                                className="
text-white/70
mb-2
"
                            >

                                Forecast Count

                            </div>

                            <div
                                className="
text-[42px]
font-bold
"
                            >

                                {
                                    summary
                                        .forecastCount
                                }

                            </div>

                        </div>

                        <div
                            className="
bg-white/10
rounded-[24px]
p-6
"
                        >

                            <div
                                className="
text-white/70
mb-2
"
                            >

                                Report

                            </div>

                            <div
                                className="
text-[42px]
font-bold
"
                            >

                                READY

                            </div>

                        </div>

                    </div>

                    <div
                        className="
mt-10
text-white/80
text-lg
leading-relaxed
"
                    >

                        Best forecasting performance currently achieved by

                        <span
                            className="
font-bold
text-white
"
                        >

                            {" "}
                            {
                                bestMethod
                            }

                        </span>

                        with average prediction error

                        <span
                            className="
font-bold
text-white
"
                        >

                            {" "}
                            {
                                averageMape
                                    .toFixed(
                                        1
                                    )
                            }
                            %

                        </span>

                        used as recommendation reference for inventory planning and restocking.

                    </div>

                </section>

            </div>

        </main>

    );

}

function Card({

    title,

    value,

}) {

    return (

        <div
            className="
bg-white
rounded-[28px]
p-8
"
        >

            <div
                className="
text-slate-400
uppercase
mb-4
"
            >

                {
                    title
                }

            </div>

            <div
                className="
text-[54px]
font-bold
"
            >

                {
                    value
                }

            </div>

        </div>

    );

}