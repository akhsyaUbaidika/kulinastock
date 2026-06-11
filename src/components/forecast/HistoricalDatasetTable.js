export default function HistoricalDatasetTable({ data }) {
    return (
        <div className="bg-white border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
                Historical Dataset Preview
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3">Date</th>
                            <th className="text-left py-3">Type</th>
                            <th className="text-left py-3">Qty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} className="border-b">
                                <td className="py-4">
                                    {row.transaction_date}
                                </td>

                                <td className="py-4">
                                    {row.transaction_type}
                                </td>

                                <td className="py-4">
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