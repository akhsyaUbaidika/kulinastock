"use client";

import { useEffect, useMemo, useState } from "react";

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
        } catch (error) {
            console.error(error);
        }
    }

    const filtered =
        useMemo(() => {
            let data = [...results];

            if (search) {
                data = data.filter(
                    (row) =>
                        row.items?.item_name
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                );
            }

            if (method !== "ALL") {
                data = data.filter(
                    (row) =>
                        row.method ===
                        method
                );
            }

            if (sort === "latest") {
                data.sort(
                    (a, b) =>
                        new Date(
                            b.created_at
                        ) -
                        new Date(
                            a.created_at
                        )
                );
            }

            if (sort === "mape") {
                data.sort(
                    (a, b) =>
                        a.mape -
                        b.mape
                );
            }

            return data;
        }, [
            results,
            search,
            method,
            sort,
        ]);
    function getMetricBadge(
        value,
        type
    ) {

        if (
            type === "mape"
        ) {

            if (value < 10)
                return "🟢";

            if (value < 20)
                return "🟡";

            return "🔴";

        }

        if (
            type === "mae"
        ) {

            if (value < 2)
                return "🟢";

            if (value < 8)
                return "🟡";

            return "🔴";

        }

        if (
            type === "rmse"
        ) {

            if (value < 3)
                return "🟢";

            if (value < 10)
                return "🟡";

            return "🔴";

        }

        return "";
    }

    return (
        <main className="p-8">

            <h1 className="text-3xl font-bold mb-8">
                Forecast Results
            </h1>

            <div className="border rounded-lg p-6 mb-8">

                <div className="grid md:grid-cols-3 gap-4">

                    <input
                        placeholder="Search item..."
                        className="border rounded p-2"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <select
                        className="border rounded p-2"
                        value={method}
                        onChange={(e) =>
                            setMethod(
                                e.target.value
                            )
                        }
                    >
                        <option>
                            ALL
                        </option>

                        <option>
                            SES
                        </option>

                        <option>
                            Holt
                        </option>

                        <option>
                            Holt-Winters
                        </option>

                    </select>

                    <select
                        className="border rounded p-2"
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

            </div>
            <div
                className="
grid
grid-cols-1
md:grid-cols-3
gap-4
mb-6
"
            >

                <div
                    className="
border
rounded-lg
p-4
"
                >

                    <p>
                        Total Results
                    </p>

                    <h2
                        className="
text-2xl
font-bold
"
                    >

                        {
                            filtered.length
                        }

                    </h2>

                </div>

                <div
                    className="
border
rounded-lg
p-4
"
                >

                    <p>
                        Best MAPE
                    </p>

                    <h2
                        className="
text-2xl
font-bold
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
                                ).toFixed(
                                    2
                                )

                                :

                                "-"
                        }

                        %

                    </h2>

                </div>

                <div
                    className="
border
rounded-lg
p-4
"
                >

                    <p>
                        Methods
                    </p>

                    <h2
                        className="
text-2xl
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
                            ].length
                        }

                    </h2>

                </div>

            </div>
            <div className="border rounded-lg p-6 overflow-auto">

                <table className="w-full">

                    <thead>

                        <tr>

                            <th className="text-left">
                                Item
                            </th>

                            <th className="text-left">
                                Method
                            </th>

                            <th className="text-left">
                                Forecast
                            </th>

                            <th className="text-left">
                                MAE
                            </th>

                            <th className="text-left">
                                MAPE
                            </th>

                            <th className="text-left">
                                RMSE
                            </th>

                            <th className="text-left">
                                Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filtered.map(
                                (
                                    row
                                ) => (
                                    <tr
                                        key={
                                            row.id
                                        }
                                        className="border-t"
                                    >

                                        <td>
                                            {
                                                row
                                                    .items
                                                    ?.item_name
                                            }
                                        </td>

                                        <td>
                                            {
                                                row.method
                                            }
                                        </td>

                                        <td>
                                            {
                                                Number(
                                                    row.forecast_value
                                                ).toFixed(
                                                    2
                                                )
                                            }
                                        </td>

                                        <td>

                                            {
                                                Number(
                                                    row.mae
                                                ).toFixed(
                                                    2
                                                )
                                            }

                                            {" "}

                                            {
                                                getMetricBadge(
                                                    row.mae,
                                                    "mae"
                                                )
                                            }

                                        </td>

                                        <td>

                                            {
                                                Number(
                                                    row.mape
                                                ).toFixed(
                                                    2
                                                )
                                            }

                                            %

                                            {" "}

                                            {
                                                getMetricBadge(
                                                    row.mape,
                                                    "mape"
                                                )
                                            }

                                        </td>

                                        <td>

                                            {
                                                Number(
                                                    row.rmse
                                                ).toFixed(
                                                    2
                                                )
                                            }

                                            {" "}

                                            {
                                                getMetricBadge(
                                                    row.rmse,
                                                    "rmse"
                                                )
                                            }

                                        </td>

                                        <td>
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

            </div>

        </main>
    );
}