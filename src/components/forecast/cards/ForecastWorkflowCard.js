export default function ForecastWorkflowCard() {

    const steps = [
        "Historical Demand",
        "Train-Test Split",
        "Method Evaluation",
        "Best Method Selection",
        "Forecast Generation",
        "Inventory Assessment"
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
                Forecast Process
            </p>

            <h2
                className="
text-3xl
font-bold
mb-8
"
            >
                Forecast Workflow
            </h2>

            <div
                className="
flex
flex-wrap
items-center
gap-3
"
            >

                {steps.map(
                    (step, index) => (

                        <div
                            key={step}
                            className="
flex
items-center
gap-3
"
                        >

                            <div
                                className="
px-5 py-3 rounded-2xl
bg-blue-50
text-blue-700
font-medium
font-semibold
"
                            >
                                {step}
                            </div>

                            {
                                index <
                                steps.length - 1 && (
                                    <span
                                        className="
text-slate-400
"
                                    >
                                        →
                                    </span>
                                )
                            }

                        </div>

                    )
                )}

            </div>

        </div>

    );

}