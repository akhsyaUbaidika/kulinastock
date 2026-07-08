"use client";

import {
    useEffect,
    useState
}

    from "react";

import Link
    from "next/link";

export default function DashboardPage() {

    const [
        data,
        setData
    ]

        =

        useState(
            null
        );

    useEffect(
        () => {

            load();

        },

        []
    );

    async function load() {

        try {

            const res =
                await fetch(
                    "/api/dashboard"
                );

            const json =
                await res.json();

            setData(
                json
            );

        }

        catch (
        err
        ) {

            console.error(
                err
            );

        }

    }

    if (
        !data
    ) {

        return (

            <main className="
min-h-screen
flex
justify-center
items-center
">

                Loading...

            </main>

        );

    }

    const {

        summary,

        lowStock,

        priorityItem

    }

        =

        data;

    const predicted3Days =
        priorityItem?.total_prediction ?? 0;



    return (

        <main className="
min-h-screen
px-8
py-8
">

            {/* HERO */}

            <div
                className="
mb-8
"
            >

                <div
                    className="
rounded-[32px]
bg-gradient-to-br
from-white
to-blue-50
border
border-slate-200/60
p-10
"
                >

                    <p
                        className="
uppercase
tracking-[0.25em]
text-blue-600
text-xs
font-semibold
mb-3
"
                    >

                        Inventory Monitoring

                    </p>

                    <h1
                        className="
text-5xl
font-bold
"
                    >

                        KulinaStock

                    </h1>

                    <p
                        className="
mt-3
text-slate-500
"
                    >

                        Inventory summary.

                    </p>

                </div>

            </div>



            {/* CARDS */}

            <div
                className="
grid
grid-cols-3
xl:grid-cols-3
gap-5
mb-8
"
            >

                {

                    [

                        [
                            "Total Items",
                            summary.totalItems
                        ],

                        // [
                        //     "Current Stock",
                        //     summary.currentStock
                        // ],

                        [
                            "Historical Records",
                            summary.historicalRecords
                        ],

                        [
                            "Forecast Ready",
                            summary.forecastReady
                        ]

                    ]

                        .map(

                            (
                                v,
                                i
                            ) => (

                                <div
                                    key={
                                        v[0]
                                    }
                                    className="
card
p-6
relative
"
                                >

                                    <div
                                        className="
text-xs
uppercase
text-slate-500
"
                                    >

                                        {
                                            v[0]
                                        }

                                    </div>

                                    <div
                                        className="
text-[40px]
font-bold
mt-3
"
                                    >

                                        {
                                            v[1]
                                        }

                                    </div>

                                    <div
                                        className="
absolute
right-4
bottom-[-8px]
text-[72px]
opacity-[0.04]
font-black
"
                                    >

                                        0{i + 1}

                                    </div>

                                </div>

                            )

                        )

                }

            </div>



            <div
                className="
grid
xl:grid-cols-[2fr_360px]
gap-6
"
            >

                {/* FORECAST SUMMARY */}

                <div
                    className="
card
p-8
"
                >

                    <h2
                        className="
text-2xl
font-bold
mb-8
"
                    >

                        Forecast Summary

                    </h2>

                    {

                        priorityItem

                            ?

                            (

                                <>

                                    <div
                                        className="
text-slate-500
"
                                    >

                                        Critical Item

                                    </div>

                                    <div
                                        className="
text-[48px]
font-bold
mb-8
"
                                    >

                                        {
                                            priorityItem
                                                .item_name
                                        }

                                    </div>



                                    <div
                                        className="
grid
md:grid-cols-4
gap-4
"
                                    >

                                        <div
                                            className="
rounded-3xl
bg-slate-50
p-6
"
                                        >

                                            <div>

                                                Current

                                            </div>

                                            <div
                                                className="
text-4xl
font-bold
mt-2
"
                                            >

                                                {
                                                    priorityItem
                                                        .current_stock
                                                }

                                            </div>
                                            <div
                                                className="
text-sm
text-slate-500
mt-1
"
                                            >

                                                {
                                                    priorityItem.small_unit
                                                }

                                            </div>
                                        </div>



                                        <div
                                            className="
rounded-3xl
bg-blue-600
text-white
p-6
"
                                        >

                                            <div>

                                                Prediction 3 Days

                                            </div>

                                            <div
                                                className="
text-4xl
font-bold
mt-2
"
                                            >

                                                {
                                                    predicted3Days
                                                }

                                            </div>
                                            <div
                                                className="
text-sm
text-blue-100
mt-1
"
                                            >

                                                {
                                                    priorityItem.small_unit
                                                }

                                            </div>

                                        </div>



                                        <div
                                            className="
rounded-3xl
bg-red-50
p-6
"
                                        >

                                            <div>

                                                Minimum

                                            </div>

                                            <div
                                                className="
text-4xl
font-bold
mt-2
text-red-600
"
                                            >

                                                {
                                                    priorityItem.minimum_stock
                                                }

                                            </div>
                                            <div
                                                className="
text-sm
text-slate-500
mt-1
"
                                            >

                                                {
                                                    priorityItem.small_unit
                                                }

                                            </div>
                                        </div>
                                        <div
                                            className="
rounded-3xl
bg-green-50
p-6
"
                                        >

                                            <div>

                                                Restock

                                            </div>

                                            <div
                                                className="
text-4xl
font-bold
mt-2
text-green-600
"
                                            >

                                                {
                                                    Math.ceil(
                                                        priorityItem.recommendation.suggested_restock /
                                                        priorityItem.qty_per_large_unit
                                                    )
                                                }

                                            </div>

                                            <div
                                                className="
text-sm
text-slate-500
mt-1
"
                                            >

                                                {
                                                    priorityItem.large_unit
                                                }

                                                <br />

                                                (
                                                {
                                                    priorityItem.recommendation.suggested_restock
                                                }

                                                {" "}

                                                {
                                                    priorityItem.small_unit
                                                }
                                                )

                                            </div>

                                        </div>

                                    </div>



                                    <Link

                                        href={
                                            `/stock-planning?item=${priorityItem.id}`
                                        }

                                        className="
mt-8
inline-flex
px-8
py-4
rounded-2xl
bg-blue-600
text-white
"
                                    >

                                        Lihat Detail

                                    </Link>

                                </>

                            )

                            :

                            (

                                <div
                                    className="
text-green-600
text-xl
"
                                >

                                    ✓
                                    Healthy

                                </div>

                            )

                    }

                </div>



                {/* WARNING */}

                <div
                    className="
space-y-6
"
                >

                    <div
                        className="
rounded-[32px]
bg-gradient-to-br
from-blue-600
to-indigo-700
text-white
p-8
"
                    >

                        <div>

                            Low Stock

                        </div>

                        <div
                            className="
text-6xl
font-black
mt-4
"
                        >

                            {
                                lowStock
                                    .length
                            }

                        </div>

                    </div>



                    <div
                        className="
card
p-6
"
                    >

                        <h3
                            className="
text-xl
font-bold
mb-5
"
                        >

                            Low Stock Warning

                        </h3>

                        <div
                            className="
space-y-3
"
                        >

                            {

                                lowStock
                                    .length

                                    ?

                                    lowStock.map(

                                        item => (

                                            <Link

                                                key={
                                                    item.id
                                                }

                                                href={
                                                    `/stock-planning?item=${item.id}`
                                                }

                                                className="
block
rounded-2xl
bg-red-50
p-5
"
                                            >

                                                <div
                                                    className="
font-semibold
"
                                                >

                                                    {
                                                        item
                                                            .item_name
                                                    }

                                                </div>

                                                <div
                                                    className="
text-slate-500
"
                                                >

                                                    Stock

                                                    {" "}

                                                    {
                                                        item.current_stock
                                                    }

                                                    /

                                                    {
                                                        item.minimum_stock
                                                    }

                                                    {" "}

                                                    {
                                                        item.small_unit
                                                    }
                                                    {
                                                        item.status === "RESTOCK"

                                                            ? (

                                                                <div
                                                                    className="
text-sm
font-semibold
text-orange-600
mt-2
"
                                                                >

                                                                    Restock {" "}

                                                                    {
                                                                        Math.ceil(
                                                                            item.recommendation.suggested_restock /
                                                                            item.qty_per_large_unit
                                                                        )
                                                                    }

                                                                    {" "}

                                                                    {
                                                                        item.large_unit
                                                                    }

                                                                </div>

                                                            )

                                                            : (

                                                                <div
                                                                    className="
text-sm
font-medium
text-slate-500
mt-2
"
                                                                >

                                                                    Histori kurang dari 14 hari

                                                                </div>

                                                            )
                                                    }
                                                </div>

                                            </Link>

                                        )

                                    )

                                    :

                                    (

                                        <div
                                            className="
text-green-600
"
                                        >

                                            Healthy

                                        </div>

                                    )

                            }

                        </div>

                    </div>

                </div>

            </div>

        </main>

    );

}