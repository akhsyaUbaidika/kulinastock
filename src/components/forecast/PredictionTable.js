export default function PredictionTable({
    predictions
}) {

    if (!predictions?.length) {
        return null;
    }

    return (

        <div
            className="
bg-white
rounded-[32px]
border
border-slate-200
shadow-sm
p-8
mb-8
"
        >

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
mb-3
"
                >
                    Forecast Result
                </h2>

                <p
                    className="
text-slate-500
"
                >
                    Forecast generated using the selected
                    forecasting model for future demand estimation.
                </p>

            </div>



            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="text-left py-4">
                                Date
                            </th>

                            <th className="text-left py-4">
                                Day
                            </th>
                            <th className="text-right py-4">
                                Predicted Demand
                            </th>

                            {/* <th className="text-right py-4">
                                Statistical Forecast
                            </th>

                            <th className="text-right py-4">
                                Factor
                            </th>

                            <th className="text-right py-4">
                                Adjusted Forecast
                            </th> */}

                        </tr>

                    </thead>

                    <tbody>

                        {(predictions || []).map(
                            (row, index) => (

                                <tr
                                    key={index}
                                    className="border-b"
                                >

                                    <td className="py-4">
                                        {row.date}
                                    </td>

                                    <td className="py-4">
                                        {row.day}
                                    </td>
                                    <td
                                        className="
py-4
text-right
font-bold
text-blue-600
"
                                    >
                                        {row.qty}
                                    </td>

                                    {/* <td
                                        className="
py-4
text-right
font-medium
"
                                    >
                                        {row.base_qty}
                                    </td>

                                    <td
                                        className="
py-4
text-right
"
                                    >
                                        {row.factor}
                                    </td>

                                    <td
                                        className="
py-4
text-right
font-bold
text-blue-600
"
                                    >
                                        {row.qty}
                                    </td> */}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}