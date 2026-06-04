import { NextResponse } from "next/server";

import ExcelJS from "exceljs";

export async function GET() {

    try {

        const host =
            process.env.NEXT_PUBLIC_APP_URL
            ||
            "http://localhost:3000";

        const [
            itemsRes,
            historyRes,
        ] =
            await Promise.all([

                fetch(
                    `${host}/api/items`,
                    {
                        cache:
                            "no-store",
                    }
                ),

                fetch(
                    `${host}/api/history`,
                    {
                        cache:
                            "no-store",
                    }
                ),

            ]);

        const items =
            (
                await itemsRes.json()
            ).data

            ||

            [];

        const history =
            (
                await historyRes.json()
            ).data

            ||

            [];

        const forecast =
            await Promise.all(

                items.map(
                    async item => {

                        try {

                            const r =
                                await fetch(

                                    `${host}/api/forecast?item_id=${item.id}&days=7`,

                                    {
                                        cache:
                                            "no-store",
                                    }

                                );

                            const j =
                                await r.json();

                            return j.data;

                        }

                        catch {

                            return null;

                        }

                    }

                )

            );

        const workbook =
            new ExcelJS.Workbook();

        workbook.creator =
            "KulinaStock";

        workbook.created =
            new Date();

        /*
        ====================
        SUMMARY
        ====================
        */

        const summary =
            workbook.addWorksheet(
                "Summary"
            );

        summary.columns = [

            {
                header:
                    "Metric",

                width:
                    30,
            },

            {
                header:
                    "Value",

                width:
                    30,
            },

        ];

        summary.addRows([

            [
                "Total Item",
                items.length,
            ],

            [
                "Total Movement",
                history.length,
            ],

            [
                "Generated",
                new Date()
                    .toLocaleString(),
            ],

        ]);

        /*
        ====================
        STOCK
        ====================
        */

        const stock =
            workbook.addWorksheet(
                "Stock"
            );

        stock.columns = [

            {
                header:
                    "Item",

                width:
                    30,
            },

            {
                header:
                    "Current",

                width:
                    18,
            },

            {
                header:
                    "Minimum",

                width:
                    18,
            },

            {
                header:
                    "Status",

                width:
                    20,
            },

        ];

        items.forEach(
            item => {

                const current =
                    Number(
                        item.stock
                        ||
                        item.current_stock
                        ||
                        0
                    );

                const minimum =
                    Number(
                        item.minimum_stock
                        ||
                        20
                    );

                stock.addRow([

                    item.item_name,

                    current,

                    minimum,

                    current
                        <=
                        minimum

                        ?

                        "LOW"

                        :

                        "SAFE",

                ]);

            }
        );

        /*
        ====================
        FORECAST
        ====================
        */

        const forecastSheet =
            workbook.addWorksheet(
                "Forecast"
            );

        forecastSheet.columns = [

            {
                header:
                    "Item",

                width:
                    26,
            },

            {
                header:
                    "Method",

                width:
                    20,
            },

            {
                header:
                    "MAPE",

                width:
                    14,
            },

            {
                header:
                    "MAE",

                width:
                    14,
            },

            {
                header:
                    "RMSE",

                width:
                    14,
            },

            {
                header:
                    "Restock",

                width:
                    18,
            },

        ];

        forecast
            .filter(
                Boolean
            )

            .forEach(
                row => {

                    const best =
                        row.methods
                            ?.find(
                                x =>
                                    x.name ===
                                    row.best_method
                            );

                    forecastSheet
                        .addRow([

                            row.item_name,

                            row.best_method,

                            Number(
                                best?.mape
                                ||
                                0
                            )
                                .toFixed(
                                    2
                                ),

                            Number(
                                best?.mae
                                ||
                                0
                            )
                                .toFixed(
                                    2
                                ),

                            Number(
                                best?.rmse
                                ||
                                0
                            )
                                .toFixed(
                                    2
                                ),

                            row.restock,

                        ]);

                }

            );

        /*
        ====================
        HISTORY
        ====================
        */

        const movement =
            workbook.addWorksheet(
                "Inventory Movement"
            );

        movement.columns = [

            {
                header:
                    "Date",

                width:
                    18,
            },

            {
                header:
                    "Item",

                width:
                    28,
            },

            {
                header:
                    "Type",

                width:
                    14,
            },

            {
                header:
                    "Qty",

                width:
                    14,
            },

        ];

        history.forEach(
            row => {

                movement.addRow([

                    row.transaction_date,

                    row.items
                        ?.item_name,

                    row.transaction_type,

                    row.qty,

                ]);

            }

        );

        const file =
            await workbook
                .xlsx
                .writeBuffer();

        return new Response(

            file,

            {

                headers: {

                    "Content-Type":

                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                    "Content-Disposition":

                        `attachment; filename=KulinaStock_Report_${Date.now()}.xlsx`

                }

            }

        );

    }

    catch (
    err
    ) {

        return NextResponse
            .json({

                success:
                    false,

                message:
                    err.message,

            });

    }

}