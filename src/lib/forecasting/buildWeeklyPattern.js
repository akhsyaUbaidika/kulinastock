const DAYS = [

    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"

];

export function buildWeeklyPattern(
    historicalSeries
) {

    if (
        !historicalSeries ||
        historicalSeries.length < 14
    ) {

        return {

            enabled: false,

            base_method: "SES",

            factors: {}

        };

    }

    const buckets = {};

    DAYS.forEach(

        day => {

            buckets[day] = [];

        }

    );

    historicalSeries.forEach(

        row => {

            const day =

                DAYS[
                new Date(
                    row.date
                ).getDay()
                ];

            buckets[day].push(
                row.demand
            );

        }

    );

    const allDemand =

        historicalSeries.map(
            x => x.demand
        );

    const overallAverage =

        allDemand.reduce(
            (a, b) => a + b,
            0
        )

        /

        allDemand.length;

    const factors = {};

    DAYS.forEach(

        day => {

            const values =
                buckets[day];

            if (
                values.length === 0
            ) {

                factors[day] = 1;

                return;

            }

            const avg =

                values.reduce(
                    (a, b) => a + b,
                    0
                )

                /

                values.length;

            factors[day] =

                Number(

                    (
                        avg
                        /
                        Math.max(
                            overallAverage,
                            1
                        )
                    )

                        .toFixed(2)

                );

        }

    );

    return {

        enabled: true,

        base_method:
            "SES",

        factors

    };

}