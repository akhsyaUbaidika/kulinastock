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
    horizon
) {

    const result = [];

    const today =
        new Date();

    for (
        let i = 1;
        i <= horizon;
        i++
    ) {

        const date =
            new Date(today);

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