"use client";

import { useEffect, useMemo, useState } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
    Trash2
} from "lucide-react";

export default function HistoryPage() {

    const [history, setHistory] = useState(null);
    const [items, setItems] = useState([]);

    const [page, setPage] =
        useState(1);

    const PAGE_SIZE = 10;

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    // const [form, setForm] =
    //     useState({

    //         item_id: "",

    //         transaction_type:
    //             "OUT",

    //         qty: 1,

    //         transaction_date:
    //             today,

    //     });

    const [transactions,
        setTransactions] =
        useState([
            {
                item_id: "",
                transaction_type: "OUT",
                qty: 1,
                transaction_date: today,
            }
        ]);

    // const [filter,
    //     setFilter] =
    //     useState({

    //         item: "",

    //         type: "",

    //         date: "",

    //     });

    const [selectedItems,
        setSelectedItems] =
        useState([]);

    const [selectedTypes,
        setSelectedTypes] =
        useState([]);

    const [startDate,
        setStartDate] =
        useState("");

    const [endDate,
        setEndDate] =
        useState("");

    const [openItems,
        setOpenItems] =
        useState(false);

    const [openTypes,
        setOpenTypes] =
        useState(false);

    const types = [
        "IN",
        "OUT"
    ];

    async function load() {

        const [h, i] =
            await Promise.all([

                fetch(
                    "/api/history"
                ),

                fetch(
                    "/api/items"
                ),

            ]);

        const historyJson =
            await h.json();

        const itemJson =
            await i.json();

        setHistory(
            historyJson
        );

        setItems(
            itemJson.data
            ||
            []
        );

    }

    useEffect(
        () => {
            load();
        },
        []
    );

    async function submit(
        e
    ) {

        e.preventDefault();

        const res =
            await fetch(

                "/api/history",

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                    },

                    body:
                        JSON.stringify({

                            transactions:
                                transactions.map(
                                    trx => ({

                                        item_id:
                                            Number(
                                                trx.item_id
                                            ),

                                        transaction_type:
                                            trx.transaction_type,

                                        qty:
                                            Number(
                                                trx.qty
                                            ),

                                        transaction_date:
                                            trx.transaction_date,

                                    })
                                )

                        })

                }

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

        // setForm({

        //     item_id:
        //         "",

        //     transaction_type:
        //         "OUT",

        //     qty:
        //         1,

        //     transaction_date:
        //         today,

        // });

        setTransactions([
            {
                item_id: "",
                transaction_type: "OUT",
                qty: 1,
                transaction_date: today,
            }
        ]);

        load();

    }

    function addRow() {

        setTransactions(prev => [

            ...prev,

            {
                item_id: "",
                transaction_type: "OUT",
                qty: 1,
                transaction_date: today,
            }

        ]);

    }

    function removeRow(index) {

        setTransactions(prev =>
            prev.filter(
                (_, i) => i !== index
            )
        );

    }

    function updateRow(
        index,
        field,
        value
    ) {

        setTransactions(prev => {

            const updated =
                [...prev];

            updated[index] = {

                ...updated[index],

                [field]:
                    value

            };

            return updated;

        });

    }

    function toggleValue(
        value,
        state,
        setState
    ) {

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

    function selectAll(
        values,
        setState
    ) {

        setState(values);

    }

    function clearAll(
        setState
    ) {

        setState([]);

    }

    // const rows =
    //     useMemo(
    //         () => {

    //             if (
    //                 !history
    //             )
    //                 return [];

    //             return history.data
    //                 .filter(
    //                     row => {

    //                         const item =
    //                             !filter.item
    //                             ||
    //                             String(
    //                                 row.items?.id
    //                             )
    //                             ===
    //                             filter.item;

    //                         const type =
    //                             !filter.type
    //                             ||
    //                             row.transaction_type
    //                             ===
    //                             filter.type;

    //                         const date =
    //                             !filter.date
    //                             ||
    //                             row.transaction_date
    //                             ===
    //                             filter.date;

    //                         return (
    //                             item
    //                             &&
    //                             type
    //                             &&
    //                             date
    //                         );

    //                     }
    //                 );

    //         },

    //         [
    //             history,
    //             filter
    //         ]

    //     );

    const rows =
        useMemo(() => {

            if (!history)
                return [];

            return history.data.filter(
                row => {

                    const itemMatch =
                        selectedItems.length === 0
                        ||
                        selectedItems.includes(
                            row.items?.item_name
                        );

                    const typeMatch =
                        selectedTypes.length === 0
                        ||
                        selectedTypes.includes(
                            row.transaction_type
                        );

                    const rowDate =
                        new Date(
                            row.transaction_date
                        );

                    const startMatch =
                        !startDate
                        ||
                        rowDate >=
                        new Date(startDate);

                    const endMatch =
                        !endDate
                        ||
                        rowDate <=
                        new Date(endDate);

                    return (
                        itemMatch
                        &&
                        typeMatch
                        &&
                        startMatch
                        &&
                        endMatch
                    );

                }
            );

        }, [

            history,
            selectedItems,
            selectedTypes,
            startDate,
            endDate,

        ]);

    if (
        !history
    )

        return (

            <div
                className="
                p-10
                "
            >

                Loading...

            </div>

        );

    function exportExcel() {

        if (
            rows.length === 0
        ) {

            alert(
                "Tidak ada data"
            );

            return;

        }

        const exportData =
            rows
                .slice(
                    (page - 1) * PAGE_SIZE,
                    page * PAGE_SIZE
                )
                .map(row => ({

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
            "Overview"

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

        const todayExport =
            new Date();

        const formattedDate =
            todayExport
                .toLocaleDateString(
                    "id-ID",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }
                )
                .replaceAll("/", "-");

        saveAs(
            blob,
            `History Stock ${formattedDate}.xlsx`
        );

    }

    return (

        <main
            className="
            min-h-screen
            px-8
            py-8
            space-y-8
            "
        >

            <section
                className="
                rounded-[40px]
                bg-[#faf5ec]
                p-12
                "
            >

                <div
                    className="
                    text-xs
                    tracking-[0.35em]
                    uppercase
                    text-orange-500
                    "
                >
                    STOCK MOVEMENT
                </div>

                <h1
                    className="
                    text-6xl
                    font-bold
                    mt-4
                    "
                >
                    History
                </h1>

                <p
                    className="
                    mt-4
                    text-slate-500
                    "
                >
                    Record inventory movement.
                </p>

            </section>

            <section
                className="
                bg-white
                rounded-[40px]
                p-8
                "
            >

                <div
                    className="
    flex
    items-center
    justify-between
    mb-6
    "
                >

                    <h2
                        className="
        text-3xl
        font-bold
        "
                    >
                        Add Transaction
                    </h2>

                    <span className="text-sm text-slate-500">
                        {transactions.length} items
                    </span>

                    <button
                        type="button"
                        onClick={addRow}
                        className="
        px-5
        py-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-slate-700
        font-medium
        hover:bg-slate-50
        transition
        font-bold
        "
                    >
                        + Add Row
                    </button>

                </div>

                {/* <form
                    onSubmit={
                        submit
                    }
                    className="
                    grid
                    grid-cols-5
                    gap-4
                    "
                >

                    <select
                        required
                        value={
                            form.item_id
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    item_id:
                                        e.target
                                            .value,

                                })
                        }
                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                    >

                        <option value="">
                            Select Item
                        </option>

                        {
                            items.map(
                                i => (

                                    <option
                                        key={
                                            i.id
                                        }
                                        value={
                                            i.id
                                        }
                                    >

                                        {
                                            i.item_name
                                        }

                                    </option>

                                )
                            )
                        }

                    </select>

                    <select
                        value={
                            form.transaction_type
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    transaction_type:
                                        e.target
                                            .value,

                                })
                        }
                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                    >

                        <option>
                            IN
                        </option>

                        <option>
                            OUT
                        </option>

                    </select>

                    <input
                        type="number"
                        min="1"
                        value={
                            form.qty
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    qty:
                                        e.target
                                            .value,

                                })
                        }
                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                    />

                    <input
                        type="date"
                        value={
                            form.transaction_date
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    transaction_date:
                                        e.target
                                            .value,

                                })
                        }
                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                    />

                    <button
                        className="
                        rounded-3xl
                        bg-blue-600
                        text-white
                        font-semibold
                        "
                    >

                        Save

                    </button>

                </form> */}
                <form
                    onSubmit={submit}
                    className="space-y-3"
                >

                    {
                        transactions.map(
                            (trx, index) => (

                                <div
                                    key={index}
                                    className="
                    grid
                    grid-cols-[2fr_1fr_1fr_1fr_auto]
gap-3
                    "
                                >

                                    <select
                                        required
                                        value={trx.item_id}
                                        onChange={e =>
                                            updateRow(
                                                index,
                                                "item_id",
                                                e.target.value
                                            )
                                        }
                                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                                    >

                                        <option value="">
                                            Select Item
                                        </option>

                                        {
                                            items.map(item => (

                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >

                                                    {item.item_name}

                                                </option>

                                            ))
                                        }

                                    </select>

                                    <select
                                        value={trx.transaction_type}
                                        onChange={e =>
                                            updateRow(
                                                index,
                                                "transaction_type",
                                                e.target.value
                                            )
                                        }
                                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                                    >

                                        <option value="IN">
                                            IN
                                        </option>

                                        <option value="OUT">
                                            OUT
                                        </option>

                                    </select>

                                    <input
                                        type="number"
                                        min="1"
                                        value={trx.qty}
                                        onChange={e =>
                                            updateRow(
                                                index,
                                                "qty",
                                                e.target.value
                                            )
                                        }
                                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                                    />

                                    <input
                                        type="date"
                                        value={trx.transaction_date}
                                        onChange={e =>
                                            updateRow(
                                                index,
                                                "transaction_date",
                                                e.target.value
                                            )
                                        }
                                        className="
                        h-16
                        rounded-3xl
                        px-5
                        bg-slate-50
                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeRow(index)
                                        }
                                        disabled={
                                            transactions.length === 1
                                        }
                                        className="
    h-14
    w-14
    rounded-2xl
    border
    border-slate-200
    bg-red
    flex
    items-center
    justify-center
    text-red-500
    hover:text-slate-800
    hover:bg-red-50
    disabled:opacity-30
    transition
    "
                                    >

                                        <Trash2
                                            size={18}
                                        />

                                    </button>

                                </div>

                            )
                        )
                    }

                    <div
                        className="
        flex
        gap-4
        "
                    >



                    </div>

                </form>
                <div
                    className="
    flex
    justify-end
    pt-4
    "
                >

                    <button
                        type="submit"
                        className="
        h-14
        px-8
        rounded-2xl
        bg-blue-600
        text-white
        font-semibold
        hover:bg-blue-700
        transition
        "
                    >

                        Save All

                    </button>

                </div>


            </section>

            <section
                className="
                bg-white
                rounded-[40px]
                p-8
                "
            >

                {/* <div
                    className="
                    flex
                    gap-4
                    mb-8
                    "
                >

                    <select
                        onChange={
                            e =>
                                setFilter({
                                    ...filter,
                                    item:
                                        e.target.value,
                                })
                        }
                        className="
                        rounded-2xl
                        p-4
                        bg-slate-50
                        "
                    >

                        <option value="">
                            All Item
                        </option>

                        {
                            items.map(
                                i => (

                                    <option
                                        key={i.id}
                                        value={i.id}
                                    >
                                        {i.item_name}
                                    </option>

                                )
                            )
                        }

                    </select>

                    <select
                        onChange={
                            e =>
                                setFilter({

                                    ...filter,

                                    type:
                                        e.target.value,

                                })
                        }
                        className="
                        rounded-2xl
                        p-4
                        bg-slate-50
                        "
                    >

                        <option value="">
                            All Type
                        </option>

                        <option>
                            IN
                        </option>

                        <option>
                            OUT
                        </option>

                    </select>

                    <input
                        type="date"
                        onChange={
                            e =>
                                setFilter({

                                    ...filter,

                                    date:
                                        e.target.value,

                                })
                        }
                        className="
                        rounded-2xl
                        p-4
                        bg-slate-50
                        "
                    />

                </div> */}
                <h2
                    className="
                    text-3xl
                    font-bold
                    mb-6
                    "
                >
                    History Transaction
                </h2>

                <div
                    className="
flex
gap-4
mb-8
flex-wrap
"
                >


                    {/* ITEM FILTER */}

                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setOpenItems(
                                    !openItems
                                )
                            }
                            className="
rounded-2xl
p-4
bg-slate-50
min-w-[220px]
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
                                        : `${selectedItems.length} item selected`
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
w-full
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
                                                    items.map(
                                                        i => i.item_name
                                                    ),
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
                                                    key={item.id}
                                                    className="
flex
items-center
gap-3
"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedItems.includes(
                                                                item.item_name
                                                            )
                                                        }
                                                        onChange={() =>
                                                            toggleValue(
                                                                item.item_name,
                                                                selectedItems,
                                                                setSelectedItems
                                                            )
                                                        }
                                                    />

                                                    <span>
                                                        {item.item_name}
                                                    </span>

                                                </label>

                                            ))
                                        }

                                    </div>

                                </div>

                            )
                        }

                    </div>

                    {/* TYPE FILTER */}

                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setOpenTypes(
                                    !openTypes
                                )
                            }
                            className="
rounded-2xl
p-4
bg-slate-50
min-w-[220px]
text-left
flex
justify-between
items-center
"
                        >

                            <span>

                                {
                                    selectedTypes.length === 0
                                        ? "All Type"
                                        : `${selectedTypes.length} type selected`
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
w-full
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

                    {/* START DATE */}

                    <input
                        type="date"
                        value={startDate}
                        onChange={e =>
                            setStartDate(
                                e.target.value
                            )
                        }
                        className="
rounded-2xl
p-4
bg-slate-50
"
                    />

                    {/* END DATE */}

                    <input
                        type="date"
                        value={endDate}
                        onChange={e =>
                            setEndDate(
                                e.target.value
                            )
                        }
                        className="
rounded-2xl
p-4
bg-slate-50
"
                    />

                    {/* EXPORT */}

                    <button
                        onClick={exportExcel}
                        className="
px-6
py-4
rounded-2xl
bg-slate-900
text-white
font-semibold
"
                    >

                        Export Excel

                    </button>

                </div>
                {/* <table
                    className="
                    w-full
                    "
                >

                    <thead>

                        <tr
                            className="
                            text-left
                            border-b
                            "
                        >

                            <th>
                                Date
                            </th>

                            <th>
                                Item
                            </th>

                            <th>
                                Type
                            </th>

                            <th>
                                Qty
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            rows
                                .slice(
                                    (page - 1) * PAGE_SIZE,
                                    page * PAGE_SIZE
                                )
                                .map(
                                    row => (

                                        <tr
                                            key={
                                                row.id
                                            }
                                            className="
                                        border-b
                                        h-16
                                        "
                                        >

                                            <td>
                                                {
                                                    row.transaction_date
                                                }
                                            </td>

                                            <td>
                                                {
                                                    row.items
                                                        ?.item_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    row.transaction_type
                                                }
                                            </td>

                                            <td>

                                                {
                                                    row.qty
                                                }

                                                {" "}

                                                {
                                                    row.items
                                                        ?.unit
                                                }

                                            </td>

                                        </tr>

                                    )
                                )
                        }

                    </tbody>

                </table> */}

                <div
                    className="
bg-white
rounded-[32px]
border
border-slate-200
overflow-auto
"
                >

                    <table
                        className="
w-full
shadow-sm
"
                    >

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
                                rows
                                    .slice(
                                        (page - 1) * PAGE_SIZE,
                                        page * PAGE_SIZE
                                    )
                                    .map(row => (

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
text-slate-600
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
                                                    row.items
                                                        ?.item_name
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
px-3
py-1
rounded-full
text-xs
font-semibold
`

                                                            : `
bg-red-100
text-red-700
px-3
py-1
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
                                                    row.items
                                                        ?.unit
                                                }

                                            </td>

                                        </tr>

                                    ))
                            }

                        </tbody>

                    </table>

                </div>
                {/* PAGINATION DI SINI */}

                <div
                    className="
flex
items-center
justify-between
mt-8
"
                >

                    <div
                        className="
text-sm
text-slate-500
font-medium
"
                    >

                        Showing

                        {" "}

                        {
                            rows.length === 0
                                ? 0
                                : (page - 1) * PAGE_SIZE + 1
                        }

                        -

                        {
                            Math.min(
                                page * PAGE_SIZE,
                                rows.length
                            )
                        }

                        {" "}of{" "}

                        {rows.length}

                        {" "}transactions

                    </div>

                    <div
                        className="
flex
items-center
gap-3
"
                    >

                        <button
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    prev => prev - 1
                                )
                            }
                            className="
px-5
py-2
rounded-xl
border
disabled:opacity-40
"
                        >

                            Previous

                        </button>

                        <div
                            className="
px-4
py-2
rounded-xl
bg-slate-100
text-sm
font-semibold
"
                        >

                            {page}

                        </div>

                        <button
                            disabled={
                                page >=
                                Math.ceil(
                                    rows.length
                                    / PAGE_SIZE
                                )
                            }
                            onClick={() =>
                                setPage(
                                    prev => prev + 1
                                )
                            }
                            className="
px-5
py-2
rounded-xl
bg-slate-900
text-white
disabled:opacity-40
"
                        >

                            Next

                        </button>

                    </div>

                </div>

            </section>

        </main>

    );

}