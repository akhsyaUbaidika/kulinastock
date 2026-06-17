export default function MethodRankingTable({
    ranking
}) {

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
                    Forecast Evaluation
                </p>

                <h2
                    className="
text-3xl
font-bold
text-[#0B132B]
"
                >
                    Method Ranking
                </h2>

            </div>

            <div className="overflow-x-auto">

                <table
                    className="
w-full
text-left
"
                >

                    <thead>

                        <tr
                            className="
border-b
border-slate-200
"
                        >

                            <th className="py-4">
                                Rank
                            </th>

                            <th className="py-4">
                                Method
                            </th>

                            <th className="py-4">
                                MAE
                            </th>

                            <th className="py-4">
                                MAPE
                            </th>

                            <th className="py-4">
                                RMSE
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {ranking.map(
                            row => (

                                <tr
                                    key={
                                        row.method
                                    }
                                    className="
border-b
border-slate-100
"
                                >

                                    <td className="py-4">

                                        {row.rank === 1
                                            ? "🥇"
                                            : row.rank === 2
                                                ? "🥈"
                                                : "🥉"}

                                    </td>

                                    <td className="py-4 font-semibold">

                                        {
                                            row.method
                                        }

                                    </td>

                                    <td className="py-4">

                                        {
                                            row.mae
                                        }

                                    </td>

                                    <td className="py-4">

                                        {
                                            row.mape
                                        }%

                                    </td>

                                    <td className="py-4">

                                        {
                                            row.rmse
                                        }

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}