export default function MethodEvaluationTable({
    methods,
    bestMethod
}) {
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
                    Evaluation
                </p>

                <h2
                    className="
text-3xl
font-bold
"
                >
                    Model Comparison
                </h2>

            </div>

            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr
                        className="
bg-slate-50
border-b
border-slate-200
hover:bg-slate-50
transition-colors
"
                    >
                        <th className="p-6 text-left py-3">Method</th>
                        <th className="p-6 text-left py-3">MAE</th>
                        <th className="p-6 text-left py-3">MAPE</th>
                        <th className="p-6 text-left py-3">RMSE</th>
                    </tr>
                </thead>

                <tbody>
                    {methods.map((method) => (
                        <tr
                            key={method.name}
                            className={`
${bestMethod?.name === method.name
                                    ? "border-b border-slate-100 hover:bg-slate-50/70 transition bg-blue-50 border-b ring-1 ring-blue-100"
                                    : "border-b border-slate-100 hover:bg-slate-50/70 transition"
                                }
                                `}
                        >
                            <td className="p-6 font-semibold">
                                {method.name}
                            </td>

                            <td className="p-6 font-semibold">
                                {method.mae}</td>
                            <td className="p-6 font-semibold">{method.mape}%</td>
                            <td className="p-6 font-semibold">{method.rmse}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}