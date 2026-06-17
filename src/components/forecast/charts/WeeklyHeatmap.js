export default function WeeklyHeatmap({
    weeklyPattern
}) {

    if (
        !weeklyPattern ||
        !weeklyPattern.enabled
    ) {
        return null;
    }

    const factors =
        weeklyPattern.factors;

    const orderedDays = [
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Minggu"
    ];

    const maxFactor =
        Math.max(
            ...Object.values(
                factors
            )
        );

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
                    Weekly Pattern
                </p>

                <h2
                    className="
text-3xl
font-bold
text-[#0B132B]
"
                >
                    Demand Heatmap
                </h2>

            </div>

            <div className="space-y-4">

                {orderedDays.map(
                    day => {

                        const factor =
                            factors[day];

                        return (

                            <div
                                key={day}
                            >

                                <div
                                    className="
flex
justify-between
mb-2
"
                                >

                                    <span
                                        className="
font-medium
"
                                    >
                                        {day}
                                    </span>

                                    <span
                                        className="
text-slate-500
"
                                    >
                                        {factor}
                                    </span>

                                </div>

                                <div
                                    className="
h-4
bg-slate-100
rounded-full
overflow-hidden
"
                                >

                                    <div
                                        className="
h-full
bg-blue-500
rounded-full
"
                                        style={{
                                            width:
                                                `${(
                                                    factor
                                                    / maxFactor
                                                ) * 100}%`
                                        }}
                                    />

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );

}