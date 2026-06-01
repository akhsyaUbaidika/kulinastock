"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportPage() {

    const reportRef =
        useRef();

    const [
        items,
        setItems
    ] = useState([]);

    const [
        history,
        setHistory
    ] = useState([]);

    const [
        forecast,
        setForecast
    ] = useState([]);

    useEffect(
        () => {
            load();
        },
        []
    );

    async function load() {

        const [
            a,
            b,
            c
        ] = await Promise.all([

            fetch("/api/items"),
            fetch("/api/history"),
            fetch("/api/forecast-results")

        ]);

        setItems(
            (await a.json())
                .data
            ||
            []
        );

        setHistory(
            (await b.json())
                .data
            ||
            []
        );

        setForecast(
            (await c.json())
                .data
            ||
            []
        );

    }

    function mapeBadge(
        v
    ) {

        if (v < 10)
            return "🟢";

        if (v < 20)
            return "🟡";

        return "🔴";

    }

    function stockStatus(
        v
    ) {

        if (v <= 10)
            return "🔴 Critical";

        if (v <= 20)
            return "🟡 Low";

        return "🟢 Healthy";

    }

    const best =
        forecast.length

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
                i.current_stock <= 20
        );

    function fileName() {

        const now =
            new Date();

        const pad =
            (
                v
            ) =>
                String(v)
                    .padStart(
                        2,
                        "0"
                    );

        return `KulinaStock_Report_${now.getFullYear()
            }-${pad(
                now.getMonth() + 1
            )
            }-${pad(
                now.getDate()
            )
            }_${pad(
                now.getHours()
            )
            }-${pad(
                now.getMinutes()
            )
            }.pdf`;

    }

    async function exportPDF() {

        const canvas =
            await html2canvas(
                reportRef.current,
                {
                    scale: 2,
                    backgroundColor: "#ffffff",
                    useCORS: true,
                }
            );

        const img =
            canvas.toDataURL(
                "image/png"
            );

        const pdf =
            new jsPDF({
                orientation:
                    "portrait",
                unit:
                    "mm",
                format:
                    "a4",
            });

        const pdfWidth =
            210;

        const pdfHeight =
            297;

        const imgWidth =
            pdfWidth - 20;

        const imgHeight =
            (
                canvas.height
                *
                imgWidth
            )
            /
            canvas.width;

        let y =
            10;

        pdf.addImage(
            img,
            "PNG",
            10,
            y,
            imgWidth,
            imgHeight
        );

        pdf.save(
            fileName()
        );

    }

    return (

        <main className="p-8">

            <div
                className="
flex
justify-between
items-center
mb-8
"
            >

                <h1
                    className="
text-4xl
font-bold
"
                >

                    Forecast Report

                </h1>

                <button

                    onClick={
                        exportPDF
                    }

                    className="
border
rounded
px-6
py-3
hover:bg-white
hover:text-black
transition
"

                >

                    Export PDF

                </button>

            </div>

            <div

                ref={
                    reportRef
                }

                className="
bg-white
text-black
rounded-xl
p-10
space-y-8
"

            >

                <h1
                    className="
text-4xl
font-bold
"
                >

                    KulinaStock Forecast Report

                </h1>

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

                <section>

                    <h2
                        className="
text-2xl
font-bold
mb-4
"
                    >

                        Forecast Performance

                    </h2>

                    <table
                        className="
w-full
border
"
                    >

                        <thead>

                            <tr>

                                <TH>
                                    Item
                                </TH>

                                <TH>
                                    Method
                                </TH>

                                <TH>
                                    MAPE
                                </TH>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                forecast.map(
                                    r => (

                                        <tr
                                            key={
                                                r.id
                                            }
                                        >

                                            <TD>

                                                {
                                                    r.items
                                                        ?.item_name
                                                }

                                            </TD>

                                            <TD>

                                                {
                                                    r.method
                                                }

                                            </TD>

                                            <TD>

                                                {
                                                    Number(
                                                        r.mape
                                                    )
                                                        .toFixed(
                                                            2
                                                        )
                                                }

                                                %

                                                {" "}

                                                {
                                                    mapeBadge(
                                                        r.mape
                                                    )
                                                }

                                            </TD>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                </section>

                <section>

                    <h2
                        className="
text-2xl
font-bold
mb-4
"
                    >

                        Stock Monitoring

                    </h2>

                    <div
                        className="
space-y-2
"
                    >

                        {
                            items.map(
                                i => (

                                    <div
                                        key={
                                            i.id
                                        }
                                    >

                                        •

                                        {" "}

                                        {
                                            i.item_name
                                        }

                                        {" — "}

                                        Stock

                                        {" "}

                                        {
                                            i.current_stock
                                        }

                                        {" — "}

                                        {
                                            stockStatus(
                                                i.current_stock
                                            )
                                        }

                                    </div>

                                )
                            )
                        }

                    </div>

                </section>

                <section>

                    <h2
                        className="
text-2xl
font-bold
mb-4
"
                    >

                        Conclusion

                    </h2>

                    <p>

                        Metode terbaik:

                        {" "}

                        <b>

                            {
                                best
                                    ?.method
                            }

                        </b>

                        {" "}

                        untuk produk

                        {" "}

                        <b>

                            {
                                best
                                    ?.items
                                    ?.item_name
                            }

                        </b>

                        .

                    </p>

                    <p
                        className="
mt-4
"
                    >

                        Produk perlu perhatian:

                        {" "}

                        <b>

                            {
                                lowStock.length
                            }

                        </b>

                    </p>

                </section>

            </div>

        </main>

    );

}

function Summary(
    {
        title,
        value
    }
) {

    return (

        <div
            className="
border
rounded
p-6
"
        >

            <h3>

                {
                    title
                }

            </h3>

            <div
                className="
text-4xl
font-bold
mt-3
"
            >

                {
                    value
                }

            </div>

        </div>

    );

}

function TH(
    {
        children
    }
) {

    return (

        <th
            className="
border
p-4
text-left
"
        >

            {
                children
            }

        </th>

    );

}

function TD(
    {
        children
    }
) {

    return (

        <td
            className="
border
p-4
"
        >

            {
                children
            }

        </td>

    );

}