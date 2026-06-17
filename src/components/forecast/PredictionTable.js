export default function PredictionTable({ predictions }) {
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
                    Forecast Result
                </p>

                <h2
                    className="
text-3xl
font-bold
"
                >
                    Demand Prediction
                </h2>

            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3">Hari</th>
                        <th className="text-left py-3">Prediksi</th>
                    </tr>
                </thead>

                <tbody>
                    {predictions.map((prediction, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-4">
                                {prediction.day}
                            </td>

                            <td className="py-4">
                                {prediction.qty}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}