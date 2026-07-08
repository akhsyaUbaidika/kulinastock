import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import {
    createAuditLog
}
    from "@/lib/audit";

export async function GET() {

    try {

        const {

            data,

            error

        }

            =

            await supabase

                .from(
                    "items"
                )

                .select(`
id,
item_name,
category,

current_stock,
minimum_stock,

small_unit,
large_unit,

qty_per_large_unit,
purchase_multiple,

created_at,
updated_at
`)

                .order(
                    "id"
                );

        if (
            error
        )

            throw error;





        const summary = {

            totalItems:
                data.length,

            categories:

                new Set(

                    data.map(
                        i =>
                            i.category
                    )

                ).size,

            totalStock:

                data.reduce(

                    (
                        a,
                        b
                    ) =>

                        a +

                        (
                            b.current_stock
                            ||
                            0
                        ),

                    0

                )

        };



        return Response.json({

            success:
                true,

            summary,

            data

        });

    }

    catch (

    err

    ) {

        return Response.json(

            {

                success:
                    false,

                message:
                    err.message

            },

            {

                status:
                    500

            }

        );

    }

}



export async function POST(

    request

) {

    try {

        const body =

            await request
                .json();



        if (

            !body.item_name

        ) {

            return Response
                .json(

                    {

                        success:
                            false,

                        message:
                            "Item name required"

                    },

                    {

                        status:
                            400

                    }

                );

        }



        const {

            data,

            error

        }

            =

            await supabase

                .from(
                    "items"
                )

                .insert([

                    {

                        item_name:

                            body
                                .item_name,

                        category:

                            body
                                .category
                            ||
                            "General",

                        small_unit:
                            body.small_unit || "pcs",

                        large_unit:
                            body.large_unit || "pcs",

                        qty_per_large_unit:
                            Number(
                                body.qty_per_large_unit || 1
                            ),

                        purchase_multiple:
                            Number(
                                body.purchase_multiple || 1
                            ),

                        minimum_stock:

                            Number(

                                body
                                    .minimum_stock

                                ||

                                20

                            ),

                        current_stock:
                            0,
                        updated_at:
                            new Date()

                    }

                ])

                .select()

                .single();



        if (
            error
        )

            throw error;


        const cookieStore =
            await cookies();

        const auth =
            cookieStore.get(
                "kulinastock_auth"
            );

        if (auth) {

            const user =
                JSON.parse(
                    auth.value
                );

            await createAuditLog({

                user_id:
                    user.id,

                table_name:
                    "items",

                record_id:
                    data.id,

                action:
                    "CREATE",

                new_value:
                    data.item_name

            });

        }

        return Response
            .json({

                success:
                    true,

                data

            });

    }

    catch (

    err

    ) {

        return Response
            .json(

                {

                    success:
                        false,

                    message:
                        err.message

                },

                {

                    status:
                        500

                }

            );

    }

}

export async function PUT(request) {

    try {

        const cookieStore =
            await cookies();

        const auth =
            cookieStore.get(
                "kulinastock_auth"
            );

        if (!auth) {

            return Response.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                {
                    status: 401
                }
            );

        }

        const user =
            JSON.parse(
                auth.value
            );

        console.log(
            "Current User:",
            user
        );


        const body =
            await request.json();

        if (!body.id) {

            return Response.json(
                {
                    success: false,
                    message: "Item id required"
                },
                {
                    status: 400
                }
            );

        }

        const {
            data: oldItem,
            error: oldError
        }

            =

            await supabase

                .from("items")

                .select("*")

                .eq("id", body.id)

                .single();

        if (oldError)
            throw oldError;



        const {

            data,

            error

        }

            =

            await supabase

                .from("items")

                .update({

                    item_name:
                        body.item_name,

                    category:
                        body.category,

                    small_unit:
                        body.small_unit,

                    large_unit:
                        body.large_unit,

                    qty_per_large_unit:
                        Number(
                            body.qty_per_large_unit
                        ),

                    purchase_multiple:
                        Number(
                            body.purchase_multiple
                        ),

                    minimum_stock:
                        Number(
                            body.minimum_stock
                        ),

                    updated_at:
                        new Date()

                })

                .eq(
                    "id",
                    body.id
                )

                .select()

                .single();

        if (error)
            throw error;
        const auditFields = [

            "item_name",
            "category",

            "small_unit",
            "large_unit",

            "qty_per_large_unit",
            "purchase_multiple",

            "minimum_stock"

        ];

        for (

            const field

            of

            auditFields

        ) {

            if (

                oldItem[field] !=
                body[field]

            ) {

                await createAuditLog({

                    user_id:
                        user.id,

                    table_name:
                        "items",

                    record_id:
                        body.id,

                    action:
                        "UPDATE",

                    field_name:
                        field,

                    old_value:
                        oldItem[field],

                    new_value:
                        body[field]

                });

            }

        }

        return Response.json({

            success: true,

            data

        });

    }

    catch (err) {

        return Response.json(

            {

                success: false,

                message: err.message

            },

            {

                status: 500

            }

        );

    }

}

export async function DELETE(

    request

) {

    try {

        const {

            searchParams

        }

            =

            new URL(
                request.url
            );



        const id =

            searchParams
                .get(
                    "id"
                );



        if (

            !id

        ) {

            return Response
                .json(

                    {

                        success:
                            false

                    },

                    {

                        status:
                            400

                    }

                );

        }



        const {

            error

        }

            =

            await supabase

                .from(
                    "items"
                )

                .delete()

                .eq(
                    "id",
                    id
                );



        if (
            error
        )

            throw error;



        return Response
            .json({

                success:
                    true

            });

    }

    catch (

    err

    ) {

        return Response
            .json(

                {

                    success:
                        false,

                    message:
                        err.message

                },

                {

                    status:
                        500

                }

            );

    }

}