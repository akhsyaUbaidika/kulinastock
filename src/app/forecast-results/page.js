"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

export default function ForecastResultsPage() {

    const [results, setResults] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [method, setMethod] =
        useState("ALL");

    const [sort, setSort] =
        useState("latest");

    useEffect(() => {

        loadData();

    }, []);

    async function loadData() {

        try {

            const response =
                await fetch(
                    "/api/forecast-results"
                );

            const result =
                await response.json();

            setResults(
                result.data || []
            );

        }

        catch (error) {

            console.error(
                error
            );

        }

    }

    const filtered =
        useMemo(() => {

            let data =
                [...results];

            if (search) {

                data =
                    data.filter(
                        row =>

                            row.items
                                ?.item_name
                                ?.toLowerCase()
                                .includes(
                                    search
                                        .toLowerCase()
                                )

                    );

            }

            if (
                method !== "ALL"
            ) {

                data =
                    data.filter(
                        row =>

                            row.method ===
                            method

                    );

            }

            if (
                sort === "latest"
            ) {

                data.sort(
                    (a, b) =>

                        new Date(
                            b.created_at
                        )

                        -

                        new Date(
                            a.created_at
                        )

                );

            }

            if (
                sort === "mape"
            ) {

                data.sort(
                    (a, b) =>

                        a.mape -
                        b.mape

                );

            }

            return data;

        },

            [
                results,
                search,
                method,
                sort,
            ]

        );

    return (

        <main className="min-h-screen px-8 py-8">

            {/* HERO */}

            <div className="mb-8">

                <div
                    className="
rounded-[32px]
bg-gradient-to-br
from-white
to-violet-50
border
border-slate-200/60
p-10
"
                >

                    <p
                        className="
uppercase
tracking-[0.25em]
text-violet-600
text-xs
font-semibold
mb-3
"
                    >

                        Forecast Archive

                    </p>

                    <h1
                        className="
text-5xl
font-bold
"
                    >

                        Forecast Results

                    </h1>

                    <p
                        className="
mt-3
text-slate-500
"
                    >

                        Review prediction performance and compare forecasting methods.

                    </p>

                </div>

            </div>




            {/* FILTER */}

            <section
                className="
        card
        px-10
        py-10
        "
            >

                <div
                    className="
            grid
            md:grid-cols-3
            gap-8
            "
                >

                    <input
                        placeholder="Search item..."
                        className="input-ui"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <select
                        className="input-ui"
                        value={method}
                        onChange={(e) =>
                            setMethod(
                                e.target.value
                            )
                        }
                    >

                        <option>ALL</option>
                        <option>SES</option>
                        <option>Holt</option>
                        <option>Holt-Winters</option>

                    </select>

                    <select
                        className="input-ui"
                        value={sort}
                        onChange={(e) =>
                            setSort(
                                e.target.value
                            )
                        }
                    >

                        <option value="latest">
                            Newest
                        </option>

                        <option value="mape">
                            Lowest MAPE
                        </option>

                    </select>

                </div>

            </section>



            {/* KPI */}

            <section
                className="
        grid
        md:grid-cols-3
        gap-6
        "
            >

                <div className="card px-8 py-8">

                    <p
                        className="
                text-sm
                uppercase
                tracking-wide
                text-slate-500
                "
                    >
                        Total Results
                    </p>

                    <h2
                        className="
                mt-5
                text-[44px]
                font-bold
                text-slate-900
                "
                    >
                        {filtered.length}
                    </h2>

                </div>


                <div className="card px-8 py-8">

                    <p
                        className="
                text-sm
                uppercase
                tracking-wide
                text-slate-500
                "
                    >
                        Best MAPE
                    </p>

                    <h2
                        className="
                mt-5
                text-[44px]
                font-bold
                text-blue-600
                "
                    >

                        {
                            filtered.length

                                ?

                                Math.min(
                                    ...filtered.map(
                                        r =>
                                            r.mape
                                    )
                                )
                                    .toFixed(2)

                                :

                                "-"
                        }

                        %

                    </h2>

                </div>


                <div className="card px-8 py-8">

                    <p
                        className="
                text-sm
                uppercase
                tracking-wide
                text-slate-500
                "
                    >
                        Methods
                    </p>

                    <h2
                        className="
                mt-5
                text-[44px]
                font-bold
                "
                    >

                        {
                            [
                                ...new Set(
                                    filtered.map(
                                        r =>
                                            r.method
                                    )
                                )
                            ]
                                .length
                        }

                    </h2>

                </div>

            </section>



            {/* TABLE */}

            <section
                className="
        card
        px-10
        py-10
        overflow-hidden
        "
            >

                <table
                    className="
            w-full
            text-[15px]
            "
                >

                    <thead>

                        <tr>

                            {
                                [
                                    "Item",
                                    "Method",
                                    "Forecast",
                                    "MAE",
                                    "MAPE",
                                    "RMSE",
                                    "Date"
                                ]

                                    .map(
                                        col => (

                                            <th
                                                key={col}
                                                className="
                                    text-left
                                    pl-3
                                    pb-8
                                    uppercase
                                    tracking-widest
                                    text-xs
                                    text-slate-500
                                    "
                                            >

                                                {col}

                                            </th>

                                        )
                                    )
                            }

                        </tr>

                    </thead>



                    <tbody>

                        {

                            filtered.map(
                                row => (

                                    <tr
                                        key={row.id}
                                        className="
                                border-t
                                border-slate-100
                                hover:bg-slate-50
                                transition
                                "
                                    >

                                        <td className="py-6 pl-3 font-semibold">

                                            {
                                                row.items
                                                    ?.item_name
                                            }

                                        </td>

                                        <td className="py-6 pl-3">

                                            <span
                                                className="
                                        rounded-full
                                        bg-blue-50
                                        text-blue-700
                                        px-3
                                        py-1
                                        text-xs
                                        "
                                            >

                                                {
                                                    row.method
                                                }

                                            </span>

                                        </td>

                                        <td className="py-6 pl-3">

                                            {
                                                Number(
                                                    row.forecast_value
                                                )
                                                    .toFixed(2)
                                            }

                                        </td>

                                        <td className="py-6 pl-3">

                                            {
                                                Number(
                                                    row.mae
                                                )
                                                    .toFixed(2)
                                            }

                                        </td>

                                        <td
                                            className="
                                    py-6
                                    pl-3
                                    font-bold
                                    text-blue-600
                                    "
                                        >

                                            {
                                                Number(
                                                    row.mape
                                                )
                                                    .toFixed(2)
                                            }

                                            %

                                        </td>

                                        <td className="py-6 pl-3">

                                            {
                                                Number(
                                                    row.rmse
                                                )
                                                    .toFixed(2)
                                            }

                                        </td>

                                        <td
                                            className="
                                    py-6
                                    pl-3
                                    text-slate-500
                                    "
                                        >

                                            {
                                                new Date(
                                                    row.created_at
                                                )
                                                    .toLocaleDateString()
                                            }

                                        </td>

                                    </tr>

                                )
                            )

                        }

                    </tbody>

                </table>

            </section>

        </main>

    )

}