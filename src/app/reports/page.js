"use client";

import {
    useEffect,
    useState,
} from "react";

export default function ReportPage() {

    const [
        items,
        setItems,
    ] =
        useState([]);

    const [
        history,
        setHistory,
    ] =
        useState([]);

    const [
        forecast,
        setForecast,
    ] =
        useState([]);

    useEffect(
        () => {

            load();

        },
        []
    );

    async function load() {

        const itemsRes =
            await fetch(
                "/api/items"
            );

        const historyRes =
            await fetch(
                "/api/history"
            );

        const forecastRes =
            await fetch(
                "/api/forecast-results"
            );

        const itemsData =
            await itemsRes.json();

        const historyData =
            await historyRes.json();

        const forecastData =
            await forecastRes.json();

        setItems(
            itemsData.data
            ||
            []
        );

        setHistory(
            historyData.data
            ||
            []
        );

        setForecast(
            forecastData.data
            ||
            []
        );

    }

    const best =
        forecast
            .length

            ?

            forecast.reduce(
                (
                    a,
                    b
                ) =>

                    a.mape
                        <
                        b.mape

                        ?

                        a

                        :

                        b
            )

            :

            null;

    const lowStock =
        items.filter(
            i =>
                i.current_stock
                <
                20
        );

    return (

        <main className="p-8">

            <h1
                className="
text-3xl
font-bold
mb-8
"
            >

                Forecast Report

            </h1>

            <div
                className="
grid
grid-cols-1
md:grid-cols-3
gap-4
mb-8
"
            >

                <div
                    className="
border
rounded-lg
p-4
"
                >

                    <h2>

                        Total Items

                    </h2>

                    <p
                        className="
text-3xl
font-bold
"
                    >

                        {
                            items.length
                        }

                    </p>

                </div>

                <div
                    className="
border
rounded-lg
p-4
"
                >

                    <h2>

                        Historical Records

                    </h2>

                    <p
                        className="
text-3xl
font-bold
"
                    >

                        {
                            history.length
                        }

                    </p>

                </div>

                <div
                    className="
border
rounded-lg
p-4
"
                >

                    <h2>

                        Forecast Results

                    </h2>

                    <p
                        className="
text-3xl
font-bold
"
                    >

                        {
                            forecast.length
                        }

                    </p>

                </div>

            </div>

            <div
                className="
border
rounded-lg
p-6
mb-8
"
            >

                <h2
                    className="
text-xl
font-semibold
mb-4
"
                >

                    Forecast Performance

                </h2>

                <table
                    className="
w-full
"
                >

                    <thead>

                        <tr>

                            <th>
                                Item
                            </th>

                            <th>
                                Method
                            </th>

                            <th>
                                MAPE
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            forecast.map(
                                (
                                    row
                                ) => (

                                    <tr
                                        key={
                                            row.id
                                        }
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
                                                    row.mape
                                                )
                                                    .toFixed(
                                                        2
                                                    )
                                            }

                                            %

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

            <div
                className="
border
rounded-lg
p-6
mb-8
"
            >

                <h2
                    className="
text-xl
font-semibold
mb-4
"
                >

                    Stock Monitoring

                </h2>

                {
                    items.map(
                        (
                            item
                        ) => (

                            <div
                                key={
                                    item.id
                                }
                                className="
mb-2
"
                            >

                                {
                                    item.item_name
                                }

                                —

                                Stock

                                {

                                    item.current_stock

                                }

                                —

                                {

                                    item.current_stock
                                        <
                                        10

                                        ?

                                        "🔴 Critical"

                                        :

                                        item.current_stock
                                            <
                                            20

                                            ?

                                            "🟡 Low"

                                            :

                                            "🟢 Healthy"

                                }

                            </div>

                        )
                    )
                }

            </div>

            <div
                className="
border
rounded-lg
p-6
"
            >

                <h2
                    className="
text-xl
font-semibold
mb-4
"
                >

                    Conclusion

                </h2>

                {
                    best

                        ?

                        (

                            <p>

                                Metode terbaik saat ini adalah

                                {" "}

                                <b>

                                    {
                                        best.method
                                    }

                                </b>

                                untuk produk

                                {" "}

                                <b>

                                    {
                                        best.items
                                            ?.item_name
                                    }

                                </b>

                                dengan nilai

                                MAPE

                                {" "}

                                <b>

                                    {
                                        Number(
                                            best.mape
                                        )
                                            .toFixed(
                                                2
                                            )
                                    }

                                    %

                                </b>

                                .

                            </p>

                        )

                        :

                        (

                            <p>

                                Belum ada data.

                            </p>

                        )

                }

                <br />

                <br />

                <p>

                    Low stock detected:

                    {" "}

                    <b>

                        {
                            lowStock.length
                        }

                    </b>

                    produk.

                </p>

            </div>

        </main>

    );

}