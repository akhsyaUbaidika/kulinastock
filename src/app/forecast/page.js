
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
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Legend,
} from "recharts";

export default function ForecastPage() {

    const [
        items,
        setItems
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        forecast,
        setForecast
    ] = useState(null);

    const [
        form,
        setForm
    ] = useState({

        item_id: "",

        start_date: "",

        days: 7,

    });

    useEffect(() => {

        load();

    }, []);

    async function load() {

        const res =
            await fetch(
                "/api/items"
            );

        const json =
            await res.json();

        const rows =
            json.data
            ||
            [];

        setItems(
            rows
        );

        if (
            rows.length
        ) {

            const d =
                new Date();

            d.setDate(
                d.getDate() - 7
            );

            setForm({

                item_id:
                    String(
                        rows[0].id
                    ),

                start_date:
                    d
                        .toISOString()
                        .slice(
                            0,
                            10
                        ),

                days: 7,

            });

        }

    }

    async function generate() {

        if (
            !form.start_date
        ) {

            alert(
                "Tanggal awal wajib"
            );

            return;

        }

        const days =
            Math.floor(

                (
                    new Date()

                    -

                    new Date(
                        form.start_date
                    )

                )

                /

                86400000

            );

        if (
            days < 7
        ) {

            alert(
                "Minimal historis 7 hari"
            );

            return;

        }

        try {

            setLoading(
                true
            );

            const res =
                await fetch(

                    `/api/forecast?item_id=${form.item_id}&days=${form.days}&start_date=${form.start_date}`

                );

            const json =
                await res.json();

            if (
                !json.success
            ) {

                alert(
                    json.message
                );

                return;

            }

            setForecast(
                json.data
            );

        }

        catch {

            alert(
                "Generate gagal"
            );

        }

        finally {

            setLoading(
                false
            );

        }

    }

    const cards =
        useMemo(() => {

            if (
                !forecast
            )
                return [];

            return [

                [
                    "Current",
                    forecast.current_stock
                ],

                [
                    "Safety",
                    forecast.safety_stock
                ],

                [
                    "Restock",
                    forecast.restock
                ],

                [
                    "Remaining",
                    forecast.remaining_stock
                ],

                [
                    "Records",
                    forecast.historical_records
                ],

                [
                    "Horizon",
                    forecast.prediction_days
                ],

            ];

        }, [
            forecast
        ]);

    const compare =
        useMemo(() => {

            if (
                !forecast
            )
                return [];

            return (
                forecast.methods
                ||
                []
            )
                .map(
                    v => ({

                        name:
                            v.name,

                        MAE:
                            Number(
                                v.mae
                            )
                                .toFixed(
                                    2
                                ),

                        MAPE:
                            Number(
                                v.mape
                            )
                                .toFixed(
                                    2
                                ),

                        RMSE:
                            Number(
                                v.rmse
                            )
                                .toFixed(
                                    2
                                ),

                    })

                );

        }, [
            forecast
        ]);

    const recommendation =
        useMemo(() => {

            if (
                !forecast
            )
                return null;

            const prediction =

                (
                    forecast
                        .forecast_result
                    ||
                    []

                )

                    .reduce(

                        (
                            a,
                            b
                        ) =>

                            a +
                            (
                                b.value
                                ||
                                0
                            ),

                        0

                    );

            return {

                prediction,

                safety:
                    forecast
                        .safety_stock,

                restock:
                    forecast
                        .restock,

            };

        }, [
            forecast
        ]);
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
"
                >

                    <p
                        className="
uppercase
tracking-[0.4em]
text-green-700
text-xs
mb-3
"
                    >

                        Forecast Engine

                    </p>

                    <h1
                        className="
text-[72px]
font-bold
leading-none
"
                    >

                        Forecast

                    </h1>

                    <p
                        className="
text-slate-500
mt-5
"
                    >

                        Generate inventory prediction.

                    </p>

                </section>

                <section
                    className="
bg-white
rounded-[36px]
p-8
mb-8
"
                >

                    <h2
                        className="
text-3xl
font-bold
mb-8
"
                    >

                        Generate

                    </h2>

                    <div
                        className="
grid
grid-cols-4
gap-5
"
                    >

                        <select
                            value={
                                form.item_id
                            }
                            onChange={
                                e =>

                                    setForm({

                                        ...form,

                                        item_id:
                                            e.target
                                                .value

                                    })

                            }
                            className="
h-16
rounded-[20px]
bg-slate-50
px-6
"
                        >

                            {

                                items.map(
                                    v =>

                                        <option
                                            key={
                                                v.id
                                            }
                                            value={
                                                v.id
                                            }
                                        >

                                            {
                                                v.item_name
                                            }

                                        </option>

                                )

                            }

                        </select>

                        <input
                            type="date"
                            max={
                                new Date()
                                    .toISOString()
                                    .slice(
                                        0,
                                        10
                                    )
                            }
                            value={
                                form.start_date
                            }
                            onChange={
                                e =>

                                    setForm({

                                        ...form,

                                        start_date:
                                            e.target
                                                .value

                                    })

                            }
                            className="
h-16
rounded-[20px]
bg-slate-50
px-6
"
                        />

                        <select
                            value={
                                form.days
                            }
                            onChange={
                                e =>

                                    setForm({

                                        ...form,

                                        days:
                                            Number(
                                                e.target
                                                    .value
                                            )

                                    })

                            }
                            className="
h-16
rounded-[20px]
bg-slate-50
px-6
"
                        >

                            {

                                [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7
                                ]

                                    .map(
                                        v =>

                                            <option
                                                key={
                                                    v
                                                }
                                                value={
                                                    v
                                                }
                                            >

                                                D+
                                                {
                                                    v
                                                }

                                            </option>

                                    )

                            }

                        </select>

                        <button
                            onClick={
                                generate
                            }
                            disabled={
                                loading
                            }
                            className="
h-16
rounded-[20px]
bg-blue-600
text-white
font-semibold
"
                        >

                            {

                                loading

                                    ?

                                    "Generating..."

                                    :

                                    "Generate"

                            }

                        </button>

                    </div>

                </section>

                {

                    forecast

                    &&

                    <>

                        <section
                            className="
grid
grid-cols-3
gap-5
mb-8
"
                        >

                            {

                                cards.map(
                                    v =>

                                        <div
                                            key={
                                                v[0]
                                            }
                                            className="
bg-white
rounded-[32px]
p-8
"
                                        >

                                            <p
                                                className="
text-sm
text-slate-400
mb-4
"
                                            >

                                                {
                                                    v[0]
                                                }

                                            </p>

                                            <div
                                                className="
text-[54px]
font-bold
"
                                            >

                                                {
                                                    v[1]
                                                }

                                            </div>

                                        </div>

                                )

                            }

                        </section>

                        <section
                            className="
bg-white
rounded-[32px]
p-8
mb-8
"
                        >

                            <h3
                                className="
text-2xl
font-bold
mb-8
"
                            >

                                Historical Trend

                            </h3>

                            <div
                                className="
h-[420px]
"
                            >

                                <ResponsiveContainer>

                                    <LineChart
                                        data={
                                            forecast
                                                .historical
                                            ||
                                            []
                                        }
                                    >

                                        <CartesianGrid />

                                        <XAxis
                                            dataKey="date"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Line
                                            type="monotone"
                                            dataKey="qty"
                                            stroke="#2563EB"
                                            strokeWidth={
                                                3
                                            }
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </section>

                        <section
                            className="
bg-white
rounded-[32px]
p-8
mb-8
"
                        >

                            <h3
                                className="
text-2xl
font-bold
mb-8
"
                            >

                                Forecast Result

                            </h3>

                            <div
                                className="
h-[360px]
"
                            >

                                <ResponsiveContainer>

                                    <BarChart
                                        data={
                                            forecast
                                                .forecast_result
                                            ||
                                            []
                                        }
                                    >

                                        <CartesianGrid />

                                        <XAxis
                                            dataKey="day"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar
                                            dataKey="value"
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

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
mb-6
"
                                >

                                    Compare Methods

                                </h3>

                                <div
                                    className="
space-y-5
"
                                >

                                    {

                                        compare.map(
                                            v =>

                                                <div
                                                    key={
                                                        v.name
                                                    }
                                                    className="
rounded-[20px]
bg-slate-50
p-5
"
                                                >

                                                    <div
                                                        className="
flex
justify-between
font-semibold
mb-4
"
                                                    >

                                                        <span>

                                                            {
                                                                v.name
                                                            }

                                                        </span>

                                                        {

                                                            forecast
                                                                .best_method
                                                            ===

                                                            v.name

                                                            &&

                                                            <span
                                                                className="
text-green-600
"
                                                            >

                                                                BEST

                                                            </span>

                                                        }

                                                    </div>

                                                    <div
                                                        className="
grid
grid-cols-3
gap-4
text-sm
"
                                                    >

                                                        <div>

                                                            <p
                                                                className="
text-slate-400
"
                                                            >

                                                                MAE

                                                            </p>

                                                            <p>

                                                                {
                                                                    v.MAE
                                                                }

                                                            </p>

                                                        </div>

                                                        <div>

                                                            <p
                                                                className="
text-slate-400
"
                                                            >

                                                                MAPE

                                                            </p>

                                                            <p>

                                                                {
                                                                    v.MAPE
                                                                }

                                                                %

                                                            </p>

                                                        </div>

                                                        <div>

                                                            <p
                                                                className="
text-slate-400
"
                                                            >

                                                                RMSE

                                                            </p>

                                                            <p>

                                                                {
                                                                    v.RMSE
                                                                }

                                                            </p>

                                                        </div>

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
mb-6
"
                                >

                                    Decision

                                </h3>

                                <div
                                    className="
space-y-6
"
                                >

                                    <div>

                                        <p
                                            className="
text-slate-400
mb-2
"
                                        >

                                            Best Method

                                        </p>

                                        <p
                                            className="
text-[28px]
font-bold
"
                                        >

                                            {
                                                forecast
                                                    .best_method
                                            }

                                        </p>

                                    </div>

                                    <div>

                                        <p
                                            className="
text-slate-400
mb-2
"
                                        >

                                            Status

                                        </p>

                                        <p
                                            className={
                                                forecast
                                                    .status
                                                    ===
                                                    "LOW"

                                                    ?

                                                    "text-red-600 text-[28px] font-bold"

                                                    :

                                                    "text-green-600 text-[28px] font-bold"
                                            }
                                        >

                                            {
                                                forecast
                                                    .status
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>

                        <section
                            className="
bg-white
rounded-[32px]
p-8
mb-8
"
                        >

                            <h3
                                className="
text-2xl
font-bold
mb-8
"
                            >

                                Restock Recommendation

                            </h3>

                            <div
                                className="
grid
grid-cols-3
gap-5
"
                            >

                                <div
                                    className="
rounded-[24px]
bg-slate-50
p-6
"
                                >

                                    <p
                                        className="
text-slate-400
mb-3
"
                                    >

                                        Prediksi Kebutuhan

                                    </p>

                                    <div
                                        className="
text-[42px]
font-bold
"
                                    >

                                        {
                                            recommendation
                                                .prediction
                                        }

                                    </div>

                                </div>

                                <div
                                    className="
rounded-[24px]
bg-slate-50
p-6
"
                                >

                                    <p
                                        className="
text-slate-400
mb-3
"
                                    >

                                        Safety Stock (10%)

                                    </p>

                                    <div
                                        className="
text-[42px]
font-bold
"
                                    >

                                        {
                                            recommendation
                                                .safety
                                        }

                                    </div>

                                </div>

                                <div
                                    className="
rounded-[24px]
bg-blue-600
text-white
p-6
"
                                >

                                    <p
                                        className="
opacity-80
mb-3
"
                                    >

                                        Saran Restock

                                    </p>

                                    <div
                                        className="
text-[42px]
font-bold
"
                                    >

                                        {
                                            recommendation
                                                .restock
                                        }

                                    </div>

                                </div>

                            </div>

                        </section>

                    </>

                }

            </div>

        </main>

    );

}