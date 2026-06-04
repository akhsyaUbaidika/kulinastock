import { supabase } from "@/lib/supabase";

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
unit,
minimum_stock,
current_stock,
created_at
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

                        unit:

                            body
                                .unit
                            ||
                            "pcs",

                        minimum_stock:

                            Number(

                                body
                                    .minimum_stock

                                ||

                                20

                            ),

                        current_stock:
                            0

                    }

                ])

                .select()

                .single();



        if (
            error
        )

            throw error;



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