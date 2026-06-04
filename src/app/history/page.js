"use client";

import { useEffect, useMemo, useState } from "react";

export default function HistoryPage() {

    const [history, setHistory] = useState(null);
    const [items, setItems] = useState([]);

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const [form, setForm] =
        useState({

            item_id: "",

            transaction_type:
                "OUT",

            qty: 1,

            transaction_date:
                today,

        });

    const [filter,
        setFilter] =
        useState({

            item: "",

            type: "",

            date: "",

        });

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

                            item_id:
                                Number(
                                    form.item_id
                                ),

                            transaction_type:
                                form.transaction_type,

                            qty:
                                Number(
                                    form.qty
                                ),

                            transaction_date:
                                form.transaction_date,

                        }),

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

        setForm({

            item_id:
                "",

            transaction_type:
                "OUT",

            qty:
                1,

            transaction_date:
                today,

        });

        load();

    }

    const rows =
        useMemo(
            () => {

                if (
                    !history
                )
                    return [];

                return history.data
                    .filter(
                        row => {

                            const item =
                                !filter.item
                                ||
                                String(
                                    row.items?.id
                                )
                                ===
                                filter.item;

                            const type =
                                !filter.type
                                ||
                                row.transaction_type
                                ===
                                filter.type;

                            const date =
                                !filter.date
                                ||
                                row.transaction_date
                                ===
                                filter.date;

                            return (
                                item
                                &&
                                type
                                &&
                                date
                            );

                        }
                    );

            },

            [
                history,
                filter
            ]

        );

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

                <h2
                    className="
                    text-3xl
                    font-bold
                    mb-6
                    "
                >
                    Add Transaction
                </h2>

                <form
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

                </form>

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

                </div>

                <table
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
                            rows.map(
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

                </table>

            </section>

        </main>

    );

}