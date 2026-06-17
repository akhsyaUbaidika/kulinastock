export default function DatasetSummaryCard({
    summary
}) {

    const metrics = [
        {
            label: "Observations",
            value:
                summary?.total_observations
        },

        {
            label: "Average Demand",
            value:
                summary?.average_demand
        },

        {
            label: "Zero Demand",
            value:
                summary?.zero_count
        },

        {
            label: "Seasonality",
            value:
                summary?.seasonality
        },

        {
            label: "Readiness",
            value:
                summary?.readiness
        },
    ];

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
                    Dataset Summary
                </p>

                <h2
                    className="
text-3xl
font-bold
text-[#0B132B]
"
                >
                    Dataset Quality
                </h2>

            </div>

            <div
                className="
grid
grid-cols-2
md:grid-cols-5
gap-6
"
            >

                {metrics.map((metric) => (

                    <div
                        key={metric.label}
                        className="
rounded-2xl
bg-slate-50
p-5
"
                    >

                        <p
                            className="
text-sm
text-slate-500
mb-2
"
                        >
                            {metric.label}
                        </p>

                        <h3
                            className={`
text-2xl
font-bold

${metric.label === "Readiness"
                                    ? metric.value === "READY"
                                        ? "text-emerald-600"
                                        : "text-red-600"
                                    : "text-slate-900"
                                }
`}
                        >
                            {metric.value}
                        </h3>

                    </div>

                ))}

            </div>

        </div>

    );

}