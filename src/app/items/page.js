"use client";

import {
    useEffect,
    useState
}

    from "react";

export default function ItemsPage() {

    const [

        payload,
        setPayload

    ]

        =

        useState(
            null
        );

    const [form, setForm] = useState({
        item_name: "",
        category: "",

        small_unit: "",
        large_unit: "",

        qty_per_large_unit: "",
        purchase_multiple: "",

        minimum_stock: ""
    });

    const [search, setSearch] = useState("");
    const [editingItem, setEditingItem] =
        useState(null);


    async function load() {

        const res =

            await fetch(
                "/api/items"
            );

        const json =

            await res.json();

        setPayload(
            json
        );

    }



    useEffect(
        () => {

            load();

        },
        []
    );



    async function submit(e) {

        e.preventDefault();

        await fetch(

            "/api/items",

            {

                method:
                    editingItem
                        ? "PUT"
                        : "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        editingItem
                            ? {
                                id:
                                    editingItem,
                                ...form
                            }
                            : form
                    )

            }

        );

        setEditingItem(null);

        setForm({
            item_name: "",
            category: "",

            small_unit: "",
            large_unit: "",

            qty_per_large_unit: "",
            purchase_multiple: "",

            minimum_stock: ""
        });

        load();

    }



    async function remove(id) {

        if (
            !confirm(
                "Hapus item?"
            )
        )

            return;

        await fetch(

            `/api/items?id=${id}`,

            {

                method:
                    "DELETE"

            }

        );

        load();

    }



    if (
        !payload
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



    const {

        summary,

        data

    }

        =

        payload;


    const filteredData = data.filter(item =>
        (item.item_name || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        (item.category || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    return (

        //         <main
        //             className="
        // p-8
        // "
        // >
        <main className="min-h-screen px-8 py-8">


            {/* HERO */}
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

                    <div
                        className="
uppercase
text-xs
tracking-[0.25em]
text-green-700
mb-3
"
                    >

                        Inventory Management

                    </div>

                    <h1
                        className="
text-5xl
font-bold
mb-3
"
                    >

                        Items

                    </h1>

                    <div
                        className="
text-slate-500
"
                    >

                        Manage inventory master.

                    </div>

                </div>

            </div>

            {/* FORM */}

            <form

                onSubmit={
                    submit
                }

                className="
card
p-8
mb-8
"

            >

                <h2
                    className="
text-2xl
font-bold
mb-2
"
                >

                    {
                        editingItem
                            ? "Edit Item"
                            : "Add Item"
                    }

                </h2>

                <p
                    className="
text-slate-500
mb-8
"
                >

                    Stock starts from 0.

                </p>



                <div
                    className="
grid
xl:grid-cols-3
gap-4
"
                >

                    <input

                        required

                        value={
                            form.item_name
                        }

                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    item_name:

                                        e.target.value

                                })

                        }

                        placeholder="Item Name (contoh: Ayam)"

                        className="
input-ui
"
                    />



                    <input

                        value={
                            form.category
                        }

                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    category:

                                        e.target.value

                                })

                        }

                        placeholder="Category (contoh: Protein)"

                        className="
input-ui
"
                    />



                    <input
                        value={form.small_unit}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                small_unit: e.target.value.toLowerCase()
                            })
                        }
                        placeholder="Small Unit (contoh: gram)"
                        className="input-ui"
                    />

                    <input
                        value={form.large_unit}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                large_unit: e.target.value.toLowerCase()
                            })
                        }
                        placeholder="Large Unit (contoh: kg)"
                        className="input-ui"
                    />

                    <input
                        type="number"
                        value={form.qty_per_large_unit}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                qty_per_large_unit: e.target.value
                            })
                        }
                        placeholder="Qty per Large Unit (contoh: 1000)"
                        className="input-ui"
                    />

                    <input
                        type="number"
                        value={form.purchase_multiple}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                purchase_multiple: e.target.value
                            })
                        }
                        placeholder="Purchase Multiple (contoh: 5)"
                        className="input-ui"
                    />





                    <input

                        type="
number
"

                        value={
                            form.minimum_stock
                        }

                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    minimum_stock:

                                        e.target.value

                                })

                        }
                        placeholder="Minimum Stock (contoh: 5)"
                        className="
input-ui
"
                    />

                </div>



                <button

                    className="
btn-primary
mt-6
"

                >

                    {
                        editingItem
                            ? "Update"
                            : "Save"
                    }

                </button>

            </form>



            {/* SUMMARY */}

            <div
                className="
grid
xl:grid-cols-3
gap-5
mb-8
"
            >

                {

                    [

                        [
                            "Items",

                            summary.totalItems
                        ],

                        [
                            "Categories",

                            summary.categories
                        ],

                        // [
                        //     "Need Attention",
                        //     data.filter(
                        //         i =>
                        //             i.current_stock <=
                        //             i.minimum_stock
                        //     ).length
                        // ]
                        // [
                        //     "Healthy Stock",
                        //     data.filter(
                        //         i =>
                        //             i.current_stock >
                        //             i.minimum_stock
                        //     ).length
                        // ]
                        [
                            "Coverage Ratio",
                            (
                                data.reduce(
                                    (acc, item) =>
                                        acc +
                                        (
                                            item.minimum_stock > 0
                                                ? item.current_stock /
                                                item.minimum_stock
                                                : 0
                                        ),
                                    0
                                ) / data.length
                            ).toFixed(1) + " x"
                        ]


                    ]

                        .map(

                            v => (

                                <div

                                    key={
                                        v[0]
                                    }

                                    className="
card
p-8
"
                                >

                                    <div
                                        className="
text-slate-500
"
                                    >

                                        {
                                            v[0]
                                        }

                                    </div>

                                    <div
                                        className="
text-5xl
font-bold
mt-3
"
                                    >

                                        {
                                            v[1]
                                        }

                                    </div>

                                </div>

                            )

                        )

                }

            </div>



            {/* LIST */}

            <div
                className="
card
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

                    Inventory List

                </h2>
                <div className="text-sm text-slate-500 mb-4">
                    Showing {filteredData.length} of {data.length} items
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search item..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-ui w-full"
                    />
                </div>


                <div
                    className="
grid
xl:grid-cols-2
gap-5
"
                >

                    {

                        filteredData.map(

                            item => (

                                <div

                                    key={
                                        item.id
                                    }

                                    className="
rounded-[32px]
bg-slate-50
p-8
"

                                >

                                    <div
                                        className="
flex
justify-between
"
                                    >

                                        <div>

                                            <div
                                                className="
text-2xl
font-bold
"
                                            >

                                                {
                                                    item.item_name
                                                }

                                            </div>

                                            <div
                                                className="
text-slate-500
"
                                            >

                                                {
                                                    item.category
                                                }

                                            </div>

                                        </div>



                                        <div className="flex gap-4">

                                            <button

                                                onClick={() => {

                                                    setEditingItem(item.id);

                                                    setForm({

                                                        item_name:
                                                            item.item_name,

                                                        category:
                                                            item.category,

                                                        small_unit:
                                                            item.small_unit,

                                                        large_unit:
                                                            item.large_unit,

                                                        qty_per_large_unit:
                                                            item.qty_per_large_unit,

                                                        purchase_multiple:
                                                            item.purchase_multiple,

                                                        minimum_stock:
                                                            item.minimum_stock

                                                    });

                                                    window.scrollTo({

                                                        top: 0,

                                                        behavior:
                                                            "smooth"

                                                    });

                                                }}

                                                className="
text-blue-600
font-medium
"

                                            >

                                                Edit

                                            </button>

                                            <button
                                                onClick={() => remove(item.id)}
                                                className="
text-red-500
"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>



                                    <div
                                        className="
mt-8
grid
grid-cols-4
"
                                    >

                                        <div>

                                            <div>

                                                Stock

                                            </div>

                                            <div
                                                className="
text-3xl
font-bold
"
                                            >

                                                {
                                                    item.current_stock
                                                }

                                            </div>
                                            <div
                                                className="
text-sm
text-slate-500
"
                                            >
                                                {item.small_unit}
                                            </div>

                                        </div>
                                        <div>

                                            <div>
                                                Minimum
                                            </div>

                                            <div
                                                className="
text-3xl
font-bold
"
                                            >
                                                {item.minimum_stock}
                                            </div>

                                            <div
                                                className="
text-sm
text-slate-500
"
                                            >
                                                {item.small_unit}
                                            </div>

                                        </div>



                                        <div>

                                            <div>

                                                Unit

                                            </div>

                                            <div className="text-2xl font-bold">
                                                {item.qty_per_large_unit}
                                                {" "}
                                                {item.small_unit}
                                            </div>

                                            <div className="text-l text-slate-500">

                                                {" / "}
                                                {item.large_unit}
                                            </div>

                                        </div>



                                        <div>

                                            <div>

                                                Status

                                            </div>

                                            <div
                                                className={

                                                    item.current_stock

                                                        <=

                                                        item.minimum_stock

                                                        ?

                                                        "text-red-600"

                                                        :

                                                        "text-green-600"

                                                }

                                            >

                                                {

                                                    item.current_stock

                                                        <=

                                                        item.minimum_stock

                                                        ?

                                                        "LOW"

                                                        :

                                                        "SAFE"

                                                }

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )

                        )

                    }

                </div>

            </div>

        </main>

    );

}