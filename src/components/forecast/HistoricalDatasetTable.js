export default function HistoricalDatasetTable({ data }) {
    return (
        <div className="bg-white
rounded-[32px]
border
border-slate-200
shadow-sm
p-8
mb-8">
            <div className="mb-8">

                <p
                    className="
uppercase
tracking-[0.25em]
text-blue-600
text-xs
font-semibold
mb-2
"
                >
                    Dataset
                </p>

                <h2
                    className="
text-3xl
font-bold
text-[#0B132B]
"
                >
                    Historical Records
                </h2>

            </div>

            <div
                className="
overflow-auto
rounded-[24px]
border
border-slate-200
"
            >
                <table className="w-full">
                    <thead>

                        <tr
                            className="
bg-slate-50
border-b
border-slate-200
"
                        >
                            <th
                                className="
text-left
p-6
font-semibold
text-slate-700
"
                            >Date</th>
                            <th
                                className="
text-left
p-6
font-semibold
text-slate-700
"
                            >Type</th>
                            <th
                                className="
text-left
p-6
font-semibold
text-slate-700
"
                            >Qty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row) => (
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
                                    {row.transaction_date}
                                </td>

                                <td
                                    className="
p-6
text-slate-600
"
                                >
                                    <span
                                        className={
                                            row.transaction_type === "IN"

                                                ? `
bg-emerald-100
text-emerald-700
px-4
py-2
rounded-full
text-xs
font-semibold
`

                                                : `
bg-red-100
text-red-700
px-4
py-2
rounded-full
text-xs
font-semibold
`
                                        }
                                    >

                                        {row.transaction_type}

                                    </span>
                                </td>

                                <td
                                    className="
p-6
text-slate-600
"
                                >
                                    {row.qty}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}