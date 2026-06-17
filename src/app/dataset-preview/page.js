
"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DatasetPreviewPage() {

    /*
    =========================
    STATE
    =========================
    */

    const [rows, setRows] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [page, setPage] =
        useState(1);

    const PAGE_SIZE = 10;

    /*
    =========================
    DROPDOWN OPEN STATE
    =========================
    */

    const [openItems, setOpenItems] =
        useState(false);

    const [openMonths, setOpenMonths] =
        useState(false);

    const [openTypes, setOpenTypes] =
        useState(false);

    /*
    =========================
    FILTER STATE
    =========================
    */

    const [selectedItems,
        setSelectedItems] =
        useState([]);

    const [selectedMonths,
        setSelectedMonths] =
        useState([]);

    const [selectedTypes,
        setSelectedTypes] =
        useState([]);

    /*
    =========================
    STATIC DATA
    =========================
    */

    const types = [
        "IN",
        "OUT",
    ];

    /*
    =========================
    LOAD DATA
    =========================
    */

    useEffect(() => {

        async function load() {

            try {

                const res =
                    await fetch(
                        "/api/history"
                    );

                const result =
                    await res.json();

                setRows(
                    result.data || []
                );

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        load();

    }, []);

    /*
    =========================
    UNIQUE ITEMS
    =========================
    */

    const items =
        useMemo(() => {

            return [

                ...new Set(

                    rows.map(
                        row =>
                            row.items?.item_name
                    )

                )

            ];

        }, [rows]);

    /*
    =========================
    UNIQUE MONTHS
    =========================
    */

    const months =
        useMemo(() => {

            return [

                ...new Set(

                    rows.map(row => {

                        return new Date(
                            row.transaction_date
                        ).toLocaleString(
                            "default",
                            {
                                month: "long",
                                year: "numeric",
                            }
                        );

                    })

                )

            ];

        }, [rows]);

    /*
    =========================
    TOGGLE VALUE
    =========================
    */

    function toggleValue(
        value,
        state,
        setState
    ) {

        setPage(1);

        setState(prev => {

            if (
                prev.includes(value)
            ) {

                return prev.filter(
                    item =>
                        item !== value
                );

            }

            return [
                ...prev,
                value
            ];

        });

    }

    /*
    =========================
    SELECT ALL
    =========================
    */

    function selectAll(
        values,
        setState
    ) {

        setPage(1);

        setState(values);

    }

    /*
    =========================
    CLEAR ALL
    =========================
    */

    function clearAll(
        setState
    ) {

        setPage(1);

        setState([]);

    }

    /*
    =========================
    FILTER DATA
    =========================
    */

    const filtered =
        useMemo(() => {

            return rows.filter(row => {

                const rowMonth =
                    new Date(
                        row.transaction_date
                    ).toLocaleString(
                        "default",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    );

                const itemMatch =
                    selectedItems.length === 0
                    ||
                    selectedItems.includes(
                        row.items?.item_name
                    );

                const monthMatch =
                    selectedMonths.length === 0
                    ||
                    selectedMonths.includes(
                        rowMonth
                    );

                const typeMatch =
                    selectedTypes.length === 0
                    ||
                    selectedTypes.includes(
                        row.transaction_type
                    );

                return (
                    itemMatch
                    &&
                    monthMatch
                    &&
                    typeMatch
                );

            });

        }, [
            rows,
            selectedItems,
            selectedMonths,
            selectedTypes,
        ]);

    /*
    =========================
    PAGINATION
    =========================
    */

    const paginated =
        filtered.slice(

            (page - 1)
            * PAGE_SIZE,

            page
            * PAGE_SIZE

        );

    const totalPages =
        Math.ceil(
            filtered.length
            / PAGE_SIZE
        );

    /*
    =========================
    UI
    =========================
    */

    function exportExcel() {

        if (
            filtered.length === 0
        ) {

            alert(
                "Tidak ada data"
            );

            return;

        }

        const exportData =
            filtered.map(row => ({

                Date:
                    row.transaction_date,

                Item:
                    row.items?.item_name,

                Type:
                    row.transaction_type,

                Qty:
                    row.qty,

                Unit:
                    row.items?.unit,

            }));

        const worksheet =
            XLSX.utils.json_to_sheet(
                exportData
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,
            worksheet,
            "Data Preview"

        );

        const excelBuffer =
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array",
                }
            );

        const blob =
            new Blob(
                [excelBuffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

        saveAs(
            blob,
            "Data-Preview.xlsx"
        );

    }

    return (

        <main className="
min-h-screen
px-8
py-8
">

            <div className="mb-8">
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
                    <p className="uppercase tracking-[0.3em] text-blue-500 text-sm">
                        Preview Data
                    </p>


                    <h1 className="text-7xl font-bold">

                        Dataset Preview

                    </h1>

                    <p className="text-2xl text-slate-500 mt-3">

                        Review and validate historical inventory data before forecasting.

                    </p>

                </div>
            </div>

            {/* FILTER */}

            <div className="flex gap-4 flex-wrap">

                {/* ITEMS */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setOpenItems(
                                !openItems
                            )
                        }
                        className="
input-ui
w-64
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
                                    : `${selectedItems.length} items selected`
                            }

                        </span>

                        <span>▼</span>

                    </button>

                    {
                        openItems && (

                            <div
                                className="
absolute
z-20
mt-2
w-64
bg-white
border
rounded-2xl
shadow-xl
p-4
max-h-72
overflow-auto
"
                            >

                                <div className="flex gap-2 mb-4">

                                    <button
                                        onClick={() =>
                                            selectAll(
                                                items,
                                                setSelectedItems
                                            )
                                        }
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
                                        onClick={() =>
                                            clearAll(
                                                setSelectedItems
                                            )
                                        }
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

                                <div className="space-y-2">

                                    {
                                        items.map(item => (

                                            <label
                                                key={item}
                                                className="
flex
items-center
gap-3
"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedItems.includes(item)
                                                    }
                                                    onChange={() =>
                                                        toggleValue(
                                                            item,
                                                            selectedItems,
                                                            setSelectedItems
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {item}
                                                </span>

                                            </label>

                                        ))
                                    }

                                </div>

                            </div>

                        )
                    }

                </div>

                {/* MONTHS */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setOpenMonths(
                                !openMonths
                            )
                        }
                        className="
input-ui
w-64
text-left
flex
justify-between
items-center
"
                    >

                        <span>

                            {
                                selectedMonths.length === 0
                                    ? "All Months"
                                    : `${selectedMonths.length} months selected`
                            }

                        </span>

                        <span>▼</span>

                    </button>

                    {
                        openMonths && (

                            <div
                                className="
absolute
z-20
mt-2
w-64
bg-white
border
rounded-2xl
shadow-xl
p-4
max-h-72
overflow-auto
"
                            >

                                <div className="flex gap-2 mb-4">

                                    <button
                                        onClick={() =>
                                            selectAll(
                                                months,
                                                setSelectedMonths
                                            )
                                        }
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
                                        onClick={() =>
                                            clearAll(
                                                setSelectedMonths
                                            )
                                        }
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

                                <div className="space-y-2">

                                    {
                                        months.map(month => (

                                            <label
                                                key={month}
                                                className="
flex
items-center
gap-3
"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedMonths.includes(month)
                                                    }
                                                    onChange={() =>
                                                        toggleValue(
                                                            month,
                                                            selectedMonths,
                                                            setSelectedMonths
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {month}
                                                </span>

                                            </label>

                                        ))
                                    }

                                </div>

                            </div>

                        )
                    }

                </div>

                {/* TYPES */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setOpenTypes(
                                !openTypes
                            )
                        }
                        className="
input-ui
w-64
text-left
flex
justify-between
items-center
"
                    >

                        <span>

                            {
                                selectedTypes.length === 0
                                    ? "All Types"
                                    : `${selectedTypes.length} types selected`
                            }

                        </span>

                        <span>▼</span>

                    </button>

                    {
                        openTypes && (

                            <div
                                className="
absolute
z-20
mt-2
w-64
bg-white
border
rounded-2xl
shadow-xl
p-4
"
                            >

                                <div className="flex gap-2 mb-4">

                                    <button
                                        onClick={() =>
                                            selectAll(
                                                types,
                                                setSelectedTypes
                                            )
                                        }
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
                                        onClick={() =>
                                            clearAll(
                                                setSelectedTypes
                                            )
                                        }
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

                                <div className="space-y-2">

                                    {
                                        types.map(type => (

                                            <label
                                                key={type}
                                                className="
flex
items-center
gap-3
"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedTypes.includes(type)
                                                    }
                                                    onChange={() =>
                                                        toggleValue(
                                                            type,
                                                            selectedTypes,
                                                            setSelectedTypes
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {type}
                                                </span>

                                            </label>

                                        ))
                                    }

                                </div>

                            </div>

                        )
                    }

                </div>

                <button
                    onClick={exportExcel}
                    className="
px-6
py-3
rounded-2xl
bg-slate-900
text-white
font-semibold
"
                >

                    Export Excel

                </button>

            </div>

            {/* TABLE */}

            <div
                className="
bg-white
rounded-[32px]
border
border-slate-200
overflow-auto
shadow-sm
"
            >

                <table className="w-full">

                    <thead>

                        <tr
                            className="
border-b
border-slate-200
bg-slate-50
"
                        >

                            <th
                                className="
text-left
p-6
font-semibold
"
                            >

                                Date

                            </th>

                            <th
                                className="
text-left
p-6
font-semibold
"
                            >

                                Item

                            </th>

                            <th
                                className="
text-left
p-6
font-semibold
"
                            >

                                Type

                            </th>

                            <th
                                className="
text-left
p-6
font-semibold
"
                            >

                                Qty

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            loading
                                ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="
p-16
text-center
text-slate-400
"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                )
                                : paginated.length === 0
                                    ? (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                className="
p-16
text-center
text-slate-400
"
                                            >

                                                No data found

                                            </td>

                                        </tr>

                                    )
                                    : (

                                        paginated.map(row => (

                                            <tr
                                                key={row.id}
                                                className="
border-b
border-slate-100
hover:bg-slate-50/70
transition
"
                                            >

                                                <td
                                                    className="
p-6
text-slate-500
"
                                                >

                                                    {
                                                        row.transaction_date
                                                    }

                                                </td>

                                                <td
                                                    className="
p-6
font-semibold
text-[#0B132B]
"
                                                >

                                                    {
                                                        row.items?.item_name
                                                    }

                                                </td>

                                                <td
                                                    className="
p-6
"
                                                >

                                                    <span
                                                        className={

                                                            row.transaction_type === "IN"

                                                                ? `
bg-emerald-100
text-emerald-700
px-4
py-2
rounded-full
text-xs
font-semibold
`

                                                                : `
bg-red-100
text-red-700
px-4
py-2
rounded-full
text-xs
font-semibold
`

                                                        }
                                                    >

                                                        {
                                                            row.transaction_type
                                                        }

                                                    </span>

                                                </td>

                                                <td
                                                    className="
p-6
font-medium
"
                                                >

                                                    {
                                                        row.qty
                                                    }

                                                    {" "}

                                                    {
                                                        row.items?.unit
                                                    }

                                                </td>

                                            </tr>

                                        ))

                                    )
                        }

                    </tbody>

                </table>

            </div>
            {/* PAGINATION */}

            <div
                className="
flex
items-center
justify-between
"
            >

                <div
                    className="
text-sm
text-slate-500
"
                >

                    Page {page} of {totalPages || 1}

                </div>

                <div className="flex gap-3">

                    <button
                        disabled={
                            page === 1
                        }
                        onClick={() =>
                            setPage(
                                page - 1
                            )
                        }
                        className="
btn-secondary
"
                    >

                        Previous

                    </button>

                    <button
                        disabled={
                            page === totalPages
                            ||
                            totalPages === 0
                        }
                        onClick={() =>
                            setPage(
                                page + 1
                            )
                        }
                        className="
btn-primary
"
                    >

                        Next

                    </button>

                </div>

            </div>

        </main>

    );

}