"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
];


export default function StockPlanningPage() {

    const [items, setItems] =
        useState([]);

    const [selectedItems,
        setSelectedItems] =
        useState([]);

    const [days, setDays] =
        useState(3);

    const [rows, setRows] =
        useState([]);

    const [openItems, setOpenItems] =
        useState(false);

    const [autoSelectedItem,
        setAutoSelectedItem] =
        useState(null);

    useEffect(() => {

        const item =
            new URLSearchParams(
                window.location.search
            ).get("item");

        setAutoSelectedItem(item);

    }, []);
    /*
    ========================
    LOAD ITEMS
    ========================
    */

    useEffect(() => {

        fetch("/api/items")
            .then(res => res.json())
            .then(data => {

                const itemList =
                    data.data || [];

                setItems(itemList);

                if (autoSelectedItem) {

                    setSelectedItems([
                        Number(autoSelectedItem)
                    ]);

                } else {

                    setSelectedItems(
                        itemList.map(
                            item => item.id
                        )
                    );

                }

            });

    }, [autoSelectedItem]);

    useEffect(() => {

        if (
            selectedItems.length === 0
        )
            return;

        generatePrediction();

    }, [
        selectedItems,
        days
    ]);
    /*
    ========================
    GENERATE DAY HEADER
    ========================
    */

    const headers =
        useMemo(() => {

            const result = [];

            for (
                let i = 1;
                i <= days;
                i++
            ) {

                const nextDate =
                    new Date();

                nextDate.setDate(
                    nextDate.getDate() + i
                );

                result.push(
                    dayNames[
                    nextDate.getDay()
                    ]
                );

            }

            return result;

        }, [days]);

    /*
    ========================
    GENERATE PREDICTION
    ========================
    */

    async function generatePrediction() {

        if (
            selectedItems.length === 0
        ) {

            alert(
                "Pilih minimal 1 item"
            );

            return;

        }

        const res =
            await fetch(

                `/api/prediction/planning?days=${days}&items=${selectedItems.join(",")}`

            );

        const data =
            await res.json();

        setRows(
            data.data || []
        );

    }

    /*
    ========================
    CHECKBOX
    ========================
    */

    function exportExcel() {

        if (rows.length === 0) {

            alert("Belum ada data");

            return;

        }

        const exportData =
            rows.map(row => {

                const dayData = {};

                headers.forEach(
                    (day, index) => {

                        dayData[day] =
                            row.daily_prediction[
                            index
                            ];

                    }
                );

                return {

                    Item:
                        row.item_name,

                    ...dayData,

                    "Total Prediksi":
                        row.total_prediction,

                    "Stock Saat Ini":
                        row.current_stock,

                    Unit:
                        row.unit,

                    "Saran Restock":
                        row.restock_suggestion,

                    Status:
                        row.status

                };

            });

        const worksheet =
            XLSX.utils.json_to_sheet(
                exportData
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Stock Planning"
        );

        const excelBuffer =
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array"
                }
            );

        const blob =
            new Blob(
                [excelBuffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

        saveAs(
            blob,
            "stock-planning.xlsx"
        );

    }

    function toggleItem(id) {

        setSelectedItems(prev => {

            if (
                prev.includes(id)
            ) {

                return prev.filter(
                    itemId =>
                        itemId !== id
                );

            }

            return [
                ...prev,
                id
            ];

        });

    }

    return (
        <main className="min-h-screen px-8 py-8">




            <div className="space-y-12 pb-16">

                <div className="mb-8">
                    <div
                        className="
rounded-[32px]
bg-gradient-to-br
from-white
to-green-50
border
border-slate-200/60
p-10
"
                    >


                        <p className="tracking-[6px] text-blue-600 text-sm uppercase mb-4">

                            Operational Planning

                        </p>

                        <h1 className="text-7xl font-bold text-[#0B132B]">

                            Stock Planning

                        </h1>

                    </div>
                </div>

                <div className="
                        bg-white
                        rounded-[32px]
                        p-10
                        border
                        border-slate-200
                        shadow-sm
                    ">

                    <div className="flex gap-12 flex-wrap">

                        <div>


                            <div className="relative w-[320px]">

                                <h3 className="font-semibold mb-4">
                                    Pilih Item
                                </h3>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenItems(!openItems)
                                    }
                                    className="
            w-full
            border
            border-slate-300
            rounded-2xl
            px-5
            py-4
            bg-white
            text-left
            flex
            justify-between
            items-center
        "
                                >

                                    <span>

                                        {
                                            selectedItems.length ===
                                                items.length
                                                ? "Semua Item"
                                                : `${selectedItems.length} item dipilih`
                                        }

                                    </span>

                                    <span>
                                        ▼
                                    </span>

                                </button>

                                {
                                    openItems && (

                                        <div
                                            className="
                    absolute
                    z-20
                    mt-3
                    w-full
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    shadow-xl
                    p-4
                    max-h-[280px]
                    overflow-auto
                "
                                        >

                                            <div className="space-y-3">

                                                {
                                                    items.map(item => (

                                                        <label
                                                            key={item.id}
                                                            className="
                                    flex
                                    items-center
                                    gap-3
                                    px-2
                                    py-2
                                    rounded-xl
                                    hover:bg-slate-50
                                "
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selectedItems.includes(
                                                                        item.id
                                                                    )
                                                                }
                                                                onChange={() =>
                                                                    toggleItem(
                                                                        item.id
                                                                    )
                                                                }
                                                            />

                                                            <span>

                                                                {
                                                                    item.item_name
                                                                }

                                                            </span>

                                                        </label>

                                                    ))
                                                }

                                            </div>

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold mb-4">

                                Horizon Prediksi

                            </h3>

                            <select
                                value={days}
                                onChange={e =>
                                    setDays(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="border rounded-xl px-4 py-3"
                            >

                                {
                                    Array.from(
                                        { length: 30 },
                                        (_, i) => i + 1
                                    ).map(day => (

                                        <option
                                            key={day}
                                            value={day}
                                        >

                                            D+{day}

                                        </option>

                                    ))
                                }

                            </select>

                        </div>

                    </div>

                    <button
                        onClick={
                            generatePrediction
                        }
                        className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
                    >

                        Generate Prediksi

                    </button>
                    <button
                        onClick={exportExcel}
                        className="
        mt-8
        ml-4
        bg-slate-900
        text-white
        px-8
        py-4
        rounded-2xl
        font-semibold
    "
                    >

                        Export Excel

                    </button>

                </div>

                <div className="bg-white rounded-[32px] border border-slate-200 overflow-auto">

                    <table className="w-full shadow-sm">

                        <thead>

                            <tr className="border-b border-slate-200">

                                <th className="text-left p-6">

                                    Item

                                </th>

                                {
                                    headers.map(day => (

                                        <th
                                            key={day}
                                            className="text-left p-6"
                                        >

                                            {day}

                                        </th>

                                    ))
                                }

                                <th className="text-left p-6">

                                    Total Prediksi

                                </th>

                                <th className="text-left p-6">

                                    Stock Saat Ini

                                </th>

                                <th className="text-left p-6">

                                    Unit

                                </th>

                                <th className="text-left p-6">

                                    Saran Restock

                                </th>

                                <th className="text-left p-6">

                                    Status

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                rows.map(row => (

                                    <tr
                                        key={row.item_id}
                                        className="border-b border-slate-100"
                                    >

                                        <td className="p-6 font-semibold">

                                            {row.item_name}

                                        </td>

                                        {
                                            row.daily_prediction.map(
                                                (
                                                    value,
                                                    index
                                                ) => (

                                                    <td
                                                        key={index}
                                                        className="p-6"
                                                    >

                                                        {value}

                                                    </td>

                                                )
                                            )
                                        }

                                        <td className="p-6 font-semibold">

                                            {
                                                row.total_prediction
                                            }

                                        </td>

                                        <td className="p-6">

                                            {
                                                row.current_stock
                                            }

                                        </td>

                                        <td className="p-6">

                                            {row.unit}

                                        </td>

                                        <td className="p-6 font-semibold text-orange-500">

                                            {
                                                row.restock_suggestion
                                            }

                                        </td>

                                        <td className="p-6">

                                            {row.status}

                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>
        </main>
    );

}