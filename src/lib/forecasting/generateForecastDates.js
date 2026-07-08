const DAYS = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
];

export function generateForecastDates(
    horizon,
    startDate
) {

    const result = [];

    const baseDate =
        startDate
            ? new Date(startDate)
            : new Date();

    for (
        let i = 0;
        i <= horizon;
        i++
    ) {

        const date =
            new Date(baseDate);

        date.setDate(
            date.getDate() + i
        );

        result.push({

            date:
                date
                    .toISOString()
                    .split("T")[0],

            day:
                DAYS[
                date.getDay()
                ]
        });
    }

    return result;
}