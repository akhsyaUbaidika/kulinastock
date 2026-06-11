export default function PredictionTable({ predictions }) {
    return (
        <div className="bg-white border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
                Prediction Result
            </h2>

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