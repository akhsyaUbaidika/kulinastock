"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
    const [items, setItems] = useState([]);
    const [history, setHistory] = useState([]);

    const [form, setForm] = useState({
        item_id: "",
        stock_used: "",
        period: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const itemRes = await fetch("/api/items");
            const itemData = await itemRes.json();

            const historyRes = await fetch("/api/history");
            const historyData = await historyRes.json();

            setItems(itemData.data || []);
            setHistory(historyData.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    async function submitHistory(e) {
        e.preventDefault();

        const response = await fetch("/api/history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                item_id: Number(form.item_id),
                stock_used: Number(form.stock_used),
                period: form.period,
            }),
        });

        const result = await response.json();

        if (result.success) {
            setForm({
                item_id: "",
                stock_used: "",
                period: "",
            });

            loadData();
        }
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-8">
                Stock History
            </h1>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Add Historical Data
                </h2>

                <form
                    onSubmit={submitHistory}
                    className="space-y-4"
                >
                    <select
                        className="border rounded p-2 w-full"
                        value={form.item_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                item_id: e.target.value,
                            })
                        }
                    >
                        <option value="">
                            Select Item
                        </option>

                        {items.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.item_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Stock Used"
                        className="border rounded p-2 w-full"
                        value={form.stock_used}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                stock_used:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        type="date"
                        className="border rounded p-2 w-full"
                        value={form.period}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                period:
                                    e.target.value,
                            })
                        }
                    />

                    <button
                        type="submit"
                        className="border rounded px-4 py-2"
                    >
                        Save History
                    </button>
                </form>
            </div>

            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Historical Records
                </h2>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">
                                Item
                            </th>

                            <th className="text-left">
                                Stock Used
                            </th>

                            <th className="text-left">
                                Period
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    {
                                        row.items
                                            ?.item_name
                                    }
                                </td>

                                <td>
                                    {row.stock_used}
                                </td>

                                <td>
                                    {row.period}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}