export default function MethodEvaluationTable({
    methods,
    bestMethod
}) {
    return (
        <div className="bg-white border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
                Method Evaluation
            </h2>

            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3">Method</th>
                        <th className="text-left py-3">MAE</th>
                        <th className="text-left py-3">MAPE</th>
                        <th className="text-left py-3">RMSE</th>
                    </tr>
                </thead>

                <tbody>
                    {methods.map((method) => (
                        <tr
                            key={method.name}
                            className={`border-b ${bestMethod?.name === method.name
                                    ? "bg-green-50"
                                    : ""
                                }`}
                        >
                            <td className="py-4 font-semibold">
                                {method.name}
                            </td>

                            <td>{method.mae}</td>
                            <td>{method.mape}%</td>
                            <td>{method.rmse}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}