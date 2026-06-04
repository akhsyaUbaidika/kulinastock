"use client";

import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportPage() {
    const reportRef = useRef();

    const [items, setItems] = useState([]);
    const [history, setHistory] = useState([]);
    const [forecast, setForecast] = useState([]);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const [a, b, c] = await Promise.all([
            fetch("/api/items"),
            fetch("/api/history"),
            fetch("/api/forecast-results"),
        ]);

        setItems((await a.json()).data || []);
        setHistory((await b.json()).data || []);
        setForecast((await c.json()).data || []);
    }

    function mapeBadge(v) {
        if (v < 10) return "🟢";
        if (v < 20) return "🟡";
        return "🔴";
    }

    function stockStatus(v) {
        if (v <= 10) return "Critical";
        if (v <= 20) return "Low";
        return "Healthy";
    }

    const best = forecast.length
        ? forecast.reduce((a, b) =>
            a.mape < b.mape ? a : b
        )
        : null;

    const lowStock = items.filter(
        i => i.current_stock <= 20
    );

    async function exportPDF() {

        const original =
            reportRef.current.style.background;

        reportRef.current.style.background =
            "#ffffff";

        const canvas =
            await html2canvas(
                reportRef.current,
                {
                    scale: 2,

                    useCORS: true,

                    backgroundColor:
                        "#ffffff",

                    logging: false,

                    ignoreElements:
                        (el) => {

                            const style =
                                window.getComputedStyle(
                                    el
                                );

                            return (
                                style.background.includes(
                                    "lab("
                                )
                            );

                        },
                }
            );

        reportRef.current.style.background =
            original;

        const img =
            canvas.toDataURL(
                "image/jpeg",
                1
            );

        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );

        const width =
            190;

        const height =
            (
                canvas.height *
                width
            )
            /
            canvas.width;

        pdf.addImage(
            img,
            "JPEG",
            10,
            10,
            width,
            height
        );

        pdf.save(
            "KulinaStock_Report.pdf"
        );

    }
    return (
        <main className="px-10 py-8 space-y-8">

            {/* HERO */}

            <section
                className="
rounded-[36px]
bg-gradient-to-br
from-white
to-indigo-50
border
border-slate-100
p-12
flex
justify-between
items-start
"
            >

                <div>

                    <p
                        className="
uppercase
tracking-[0.25em]
text-purple-600
text-xs
font-bold
mb-4
"
                    >
                        Forecast Archive
                    </p>

                    <h1
                        className="
text-6xl
font-bold
text-slate-900
mb-4
"
                    >
                        Forecast Report
                    </h1>

                    <p
                        className="
text-slate-500
text-xl
"
                    >
                        Review prediction
                        performance and
                        export forecasting
                        reports.
                    </p>

                </div>

                <button
                    onClick={
                        exportPDF
                    }
                    className="
bg-blue-600
text-white
px-8
py-4
rounded-2xl
font-semibold
hover:scale-[1.02]
transition
"
                >
                    Export PDF
                </button>

            </section>



            <div
                ref={reportRef}
                className="
space-y-8
"
            >

                {/* SUMMARY */}

                <div
                    className="
grid
grid-cols-3
gap-6
"
                >

                    <Summary
                        title="Total Items"
                        value={
                            items.length
                        }
                    />

                    <Summary
                        title="Historical"
                        value={
                            history.length
                        }
                    />

                    <Summary
                        title="Forecast"
                        value={
                            forecast.length
                        }
                    />

                </div>



                {/* TABLE */}

                <section
                    className="
card
bg-white
rounded-[32px]
border
border-slate-100
p-10
"
                >

                    <h2
                        className="
text-3xl
font-bold
mb-2
"
                    >
                        Forecast Performance
                    </h2>

                    <p
                        className="
text-slate-500
mb-8
"
                    >
                        Compare accuracy
                        between methods
                    </p>

                    <div className="overflow-auto">

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
                                            "MAPE"
                                        ]

                                            .map(
                                                col => (

                                                    <th
                                                        key={col}
                                                        className="
text-left
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

                                    forecast.map(
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

                                                <td
                                                    className="
py-6
font-semibold
"
                                                >

                                                    {
                                                        row.items
                                                            ?.item_name
                                                    }

                                                </td>


                                                <td
                                                    className="
py-6
"
                                                >

                                                    {
                                                        row.method
                                                    }

                                                </td>


                                                <td
                                                    className="
py-6
font-bold
text-blue-600
"
                                                >

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

                </section>



                {/* LOWER */}

                <div
                    className="
grid
grid-cols-2
gap-8
"
                >

                    <section
                        className="
bg-white
rounded-[32px]
border
border-slate-100
p-8
"
                    >

                        <h2
                            className="
text-3xl
font-bold
mb-8
"
                        >
                            Stock Monitoring
                        </h2>

                        <div
                            className="
space-y-4
"
                        >

                            {
                                items.map(
                                    (
                                        i
                                    ) => (

                                        <div
                                            key={
                                                i.id
                                            }
                                            className="
rounded-2xl
bg-slate-50
p-5
flex
justify-between
"
                                        >

                                            <div>

                                                <div
                                                    className="
font-semibold
"
                                                >
                                                    {
                                                        i.item_name
                                                    }
                                                </div>

                                                <div
                                                    className="
text-slate-500
"
                                                >
                                                    {
                                                        stockStatus(
                                                            i.current_stock
                                                        )
                                                    }
                                                </div>

                                            </div>

                                            <div
                                                className="
text-3xl
font-bold
"
                                            >

                                                {
                                                    i.current_stock
                                                }

                                            </div>

                                        </div>

                                    )
                                )
                            }

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
"
                    >

                        <p
                            className="
uppercase
tracking-widest
opacity-70
mb-6
"
                        >
                            Conclusion
                        </p>

                        <h2
                            className="
text-5xl
font-bold
mb-8
"
                        >
                            {
                                best
                                    ?.method
                            }
                        </h2>

                        <p
                            className="
text-xl
"
                        >
                            Best for

                            <br />

                            <b>

                                {
                                    best
                                        ?.items
                                        ?.item_name
                                }

                            </b>

                        </p>

                        <div
                            className="
mt-10
pt-8
border-t
border-white/20
"
                        >

                            <div>
                                Low Stock
                            </div>

                            <div
                                className="
text-6xl
font-bold
"
                            >
                                {
                                    lowStock.length
                                }
                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}

function Summary({
    title,
    value,
}) {
    return (
        <div
            className="
bg-white
rounded-[28px]
border
border-slate-100
p-8
"
        >
            <p
                className="
uppercase
text-slate-500
mb-4
"
            >
                {title}
            </p>

            <div
                className="
text-5xl
font-bold
"
            >
                {value}
            </div>
        </div>
    );
}

function TH({
    children,
}) {
    return (
        <th className="py-5">
            {children}
        </th>
    );
}

function TD({
    children,
}) {
    return (
        <td className="py-5">
            {children}
        </td>
    );
}