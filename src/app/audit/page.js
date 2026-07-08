"use client";

import {
    useEffect,
    useState
}
    from "react";

export default function AuditPage() {

    const [
        data,
        setData
    ]
        =
        useState([]);

    async function load() {

        const res =
            await fetch(
                "/api/audit"
            );

        const json =
            await res.json();

        setData(
            json.data || []
        );

    }

    useEffect(
        () => {
            load();
        },
        []
    );

    return (

        <main className="min-h-screen p-8">

            <div className="card p-8">

                <h1
                    className="
                    text-4xl
                    font-bold
                    mb-8
                    "
                >
                    Audit Trail
                </h1>

                <div className="space-y-4">

                    {
                        data.map(
                            log => (

                                <div
                                    key={log.id}
                                    className="
                                    rounded-3xl
                                    bg-slate-50
                                    p-6
                                    "
                                >

                                    <div className="flex justify-between">

                                        <div>

                                            <div className="font-bold">

                                                {
                                                    log.users?.username ||
                                                    "Unknown"
                                                }

                                            </div>

                                            <div className="text-slate-500">

                                                {
                                                    log.action
                                                }

                                                {" "}

                                                {
                                                    log.table_name
                                                }

                                            </div>

                                        </div>

                                        <div
                                            className="
                                            text-sm
                                            text-slate-500
                                            "
                                        >

                                            {
                                                new Date(
                                                    log.created_at
                                                )
                                                    .toLocaleString(
                                                        "id-ID"
                                                    )
                                            }

                                        </div>

                                    </div>

                                    <div className="mt-4">

                                        {

                                            log.field_name

                                                ?

                                                <>

                                                    <span className="font-semibold">

                                                        {
                                                            log.field_name
                                                        }

                                                    </span>

                                                    {" : "}

                                                    {
                                                        log.old_value
                                                    }

                                                    {" → "}

                                                    {
                                                        log.new_value
                                                    }

                                                </>

                                                :

                                                log.new_value

                                        }

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