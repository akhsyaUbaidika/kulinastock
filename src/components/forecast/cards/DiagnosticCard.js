export default function DiagnosticCard({
    diagnostic
}) {

    if (!diagnostic) {
        return null;
    }

    const items = [
        {
            label: "Contains Zero Demand",
            value:
                diagnostic.contains_zero_demand
                    ? "YES"
                    : "NO"
        },
        {
            label: "Zero Count",
            value:
                diagnostic.zero_count
        },
        {
            label: "Seasonality Detected",
            value:
                diagnostic.seasonality_detected
                    ? "YES"
                    : "NO"
        },
        {
            label: "Season Length",
            value:
                diagnostic.season_length
        },
        {
            label: "Recommended Method",
            value:
                diagnostic.recommended_method
        }
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
                Diagnostic
            </p>

            <h2
                className="
text-3xl
font-bold
text-[#0B132B]
mb-8
"
            >
                Dataset Analysis
            </h2>

            <div
                className="
grid
grid-cols-1
md:grid-cols-2
gap-6
"
            >

                {items.map(
                    item => (

                        <div
                            key={item.label}
                            className="
bg-slate-50
rounded-2xl
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
                                {item.label}
                            </p>

                            <p
                                className={`
text-2xl
font-bold

${item.value === "YES"
                                        ? "text-emerald-600"
                                        : item.value === "NO"
                                            ? "text-red-600"
                                            : "text-slate-900"
                                    }
`}
                            >
                                {item.value}
                            </p>

                        </div>

                    )
                )}

            </div>

        </div>

    );

}