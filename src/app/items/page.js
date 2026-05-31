"use client";

import { useEffect, useState } from "react";

export default function ItemsPage() {
    const [items, setItems] = useState([]);

    const [form, setForm] = useState({
        item_name: "",
        category: "",
        current_stock: "",
    });

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        const response = await fetch("/api/items");

        const result = await response.json();

        setItems(result.data || []);
    }

    async function submitItem(e) {
        e.preventDefault();

        const response = await fetch("/api/items", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                item_name: form.item_name,
                category: form.category,
                current_stock: Number(
                    form.current_stock
                ),
            }),
        });

        const result = await response.json();

        if (result.success) {
            setForm({
                item_name: "",
                category: "",
                current_stock: "",
            });

            loadItems();
        }
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-8">
                Inventory Items
            </h1>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Add Item
                </h2>

                <form
                    onSubmit={submitItem}
                    className="space-y-4"
                >
                    <input
                        className="border p-2 w-full rounded"
                        placeholder="Item Name"
                        value={form.item_name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                item_name:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        className="border p-2 w-full rounded"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        className="border p-2 w-full rounded"
                        type="number"
                        placeholder="Current Stock"
                        value={
                            form.current_stock
                        }
                        onChange={(e) =>
                            setForm({
                                ...form,
                                current_stock:
                                    e.target.value,
                            })
                        }
                    />

                    <button
                        type="submit"
                        className="border px-4 py-2 rounded"
                    >
                        Save Item
                    </button>
                </form>
            </div>

            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Item List
                </h2>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">
                                Name
                            </th>

                            <th className="text-left">
                                Category
                            </th>

                            <th className="text-left">
                                Stock
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {
                                        item.item_name
                                    }
                                </td>

                                <td>
                                    {item.category}
                                </td>

                                <td>
                                    {
                                        item.current_stock
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}