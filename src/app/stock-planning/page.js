"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import StockPlanningContent from "./StockPlanningContent";

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
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StockPlanningContent />
        </Suspense>
    );
}
export default function StockPlanningContent() {


    const [items, setItems] =
        useState([]);

    const [selectedItems,
        setSelectedItems] =
        useState([]);

    const [days, setDays] =
        useState(3);

    const [sortBy, setSortBy] =
        useState("name");

    const [rows, setRows] =
        useState([]);
    const [currentPage, setCurrentPage] =
        useState(1);

    const PAGE_SIZE = 15;

    const [openItems, setOpenItems] =
        useState(false);


    const searchParams =
        useSearchParams();

    const autoSelectedItem =
        Number(
            searchParams.get("item")
        );
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

                result.push({
                    label: dayNames[nextDate.getDay()],
                    date: nextDate.toISOString().split("T")[0]
                });

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

        setCurrentPage(1);
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
            sortedRows.map(row => {

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
                        row.small_unit,

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

    function selectAllItems() {

        setSelectedItems(
            items.map(
                item => item.id
            )
        );

    }

    function clearAllItems() {

        setSelectedItems([]);

    }

    const sortedRows =
        useMemo(() => {

            const data = [...rows];

            if (sortBy === "name") {

                data.sort((a, b) =>
                    a.item_name.localeCompare(
                        b.item_name
                    )
                );

            }

            if (sortBy === "priority") {

                data.sort((a, b) => {

                    const getPriority = row => {

                        if (
                            row.status ===
                            "INSUFFICIENT_HISTORY"
                        )
                            return 1;

                        if (
                            row.recommendation
                                ?.suggested_restock > 0
                        )
                            return 0;

                        return 2;

                    };

                    return (
                        getPriority(a) -
                        getPriority(b)
                    );

                });

            }

            return data;

        }, [rows, sortBy]);
    const totalPages =
        Math.ceil(
            sortedRows.length /
            PAGE_SIZE
        );

    const paginatedRows =
        useMemo(() => {

            const start =
                (currentPage - 1) *
                PAGE_SIZE;

            return sortedRows.slice(
                start,
                start + PAGE_SIZE
            );

        }, [
            sortedRows,
            currentPage
        ]);
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
                                            selectedItems.length === 0
                                                ? "All Items"
                                                : selectedItems.length === items.length
                                                    ? "All Items"
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
                    z-50
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
                                            <div className="flex gap-2 mb-4">

                                                <button
                                                    onClick={selectAllItems}
                                                    className="
text-xs
px-3
py-1
rounded-xl
bg-slate-100
"
                                                >

                                                    Select All

                                                </button>

                                                <button
                                                    onClick={clearAllItems}
                                                    className="
text-xs
px-3
py-1
rounded-xl
bg-red-100
text-red-600
"
                                                >

                                                    Clear

                                                </button>

                                            </div>

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
                        <div>

                            <h3 className="font-semibold mb-4">

                                Urutkan

                            </h3>

                            <select
                                value={sortBy}
                                onChange={e =>
                                    setSortBy(e.target.value)
                                }
                                className="border rounded-xl px-4 py-3"
                            >

                                <option value="name">
                                    Nama Barang
                                </option>

                                <option value="priority">
                                    Prioritas Restock
                                </option>

                            </select>

                        </div>

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

                    {/* <button
                        onClick={
                            generatePrediction
                        }
                        className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
                    >

                        Generate Prediksi

                    </button> */}


                </div>

                <div className="bg-white rounded-[32px] border border-slate-200 overflow-auto">

                    <table className="w-full shadow-sm">

                        <thead>

                            <tr className="border-b border-slate-200">
                                <th
                                    className="
        sticky
        left-0
        bg-white
        z-20
        text-left
        p-6
        shadow-sm
    "
                                >

                                    Item

                                </th>

                                {


                                    headers.map(header => (
                                        <th
                                            key={header.date}
                                            className="text-left p-6"
                                        >

                                            <div className="font-semibold">
                                                {header.label}
                                            </div>

                                            {
                                                days > 7 && (
                                                    <div className="
            text-xs
            text-slate-500
            mt-1
        ">
                                                        {
                                                            new Date(header.date)
                                                                .toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short"
                                                                    }
                                                                )
                                                        }
                                                    </div>
                                                )
                                            }

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

                            </tr>

                        </thead>

                        <tbody>

                            {
                                paginatedRows.map(row => (

                                    <tr
                                        key={row.item_id}
                                        className="border-b border-slate-100"
                                    >
                                        <td
                                            className="
        sticky
        left-0
        bg-white
        z-10
        p-6
        font-semibold
        shadow-sm
    "
                                        >

                                            {row.item_name}

                                        </td>

                                        {
                                            row.daily_prediction?.map(
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

                                            {row.small_unit}

                                        </td>

                                        <td className="p-6 font-semibold text-orange-500">

                                            {
                                                row.status === "INSUFFICIENT_HISTORY"
                                                    ? (
                                                        <span className="
                text-slate-500
                italic
            ">
                                                            Histori kurang dari 14 hari
                                                        </span>
                                                    )
                                                    : row.recommendation?.suggested_restock > 0
                                                        ? (
                                                            <div>

                                                                <div className="
                    font-semibold
                    text-orange-500
                ">

                                                                    {
                                                                        row.recommendation
                                                                            .suggested_restock
                                                                    } {
                                                                        row.large_unit
                                                                    }

                                                                </div>

                                                                <div className="
                    text-xs
                    text-slate-500
                ">

                                                                    (
                                                                    {
                                                                        row.recommendation
                                                                            .raw_restock
                                                                    } {
                                                                        row.small_unit
                                                                    }
                                                                    )

                                                                </div>

                                                            </div>
                                                        )
                                                        : (
                                                            <span className="
                    text-green-600
                    font-medium
                ">
                                                                Aman
                                                            </span>
                                                        )
                                            }

                                        </td>



                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>
                    <div
                        className="
flex
justify-between
items-center
px-6
py-5
border-t
border-slate-200
"
                    >

                        <div
                            className="
text-sm
text-slate-500
"
                        >

                            Menampilkan{" "}

                            {
                                Math.min(
                                    (currentPage - 1) * PAGE_SIZE + 1,
                                    sortedRows.length
                                )
                            }

                            -

                            {
                                Math.min(
                                    currentPage * PAGE_SIZE,
                                    sortedRows.length
                                )
                            }

                            {" "}dari{" "}

                            {
                                sortedRows.length
                            }

                            {" "}item

                        </div>

                        <div
                            className="
flex
items-center
gap-2
"
                        >

                            <button

                                disabled={
                                    currentPage === 1
                                }

                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            prev - 1
                                    )
                                }

                                className="
px-4
py-2
rounded-xl
border
disabled:opacity-40
"
                            >

                                ←

                            </button>

                            <span
                                className="
px-4
font-semibold
"
                            >

                                {
                                    currentPage
                                }

                                /

                                {
                                    totalPages || 1
                                }

                            </span>

                            <button

                                disabled={
                                    currentPage === totalPages
                                }

                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            prev + 1
                                    )
                                }

                                className="
px-4
py-2
rounded-xl
border
disabled:opacity-40
"
                            >

                                →

                            </button>

                        </div>

                    </div>
                </div>

            </div>
        </main>
    );

}