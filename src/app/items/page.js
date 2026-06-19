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

    const [

        form,
        setForm

    ]

        =

        useState({

            item_name: "",
            category: "",
            unit: "",
            minimum_stock: 20

        });

    const [search, setSearch] = useState("");



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
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:

                    JSON.stringify(
                        form
                    )

            }

        );

        setForm({

            item_name: "",
            category: "",
            unit: "",
            minimum_stock: 20

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

                    Add Item

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
xl:grid-cols-4
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

                        placeholder="
Item Name
"

                        className="
input
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

                        placeholder="
Category
"

                        className="
input
"
                    />



                    <input

                        value={
                            form.unit
                        }

                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    unit:

                                        e.target.value

                                })

                        }

                        placeholder="
Unit
"

                        className="
input
"
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

                        className="
input
"
                    />

                </div>



                <button

                    className="
mt-5
px-8
py-4
rounded-2xl
bg-blue-600
text-white
"

                >

                    Save

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

                        [
                            "Stock",

                            summary.totalStock
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
                        className="input w-full"
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



                                        <button

                                            onClick={
                                                () => remove(
                                                    item.id
                                                )
                                            }

                                            className="
text-red-500
"

                                        >

                                            Delete

                                        </button>

                                    </div>



                                    <div
                                        className="
mt-8
grid
grid-cols-3
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

                                        </div>



                                        <div>

                                            <div>

                                                Unit

                                            </div>

                                            <div
                                                className="
font-bold
"
                                            >

                                                {
                                                    item.unit
                                                }

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