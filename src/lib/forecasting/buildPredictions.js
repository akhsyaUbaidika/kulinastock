import { generateForecastDates }
    from "./generateForecastDates";

export function buildPredictions(
    forecast
) {

    const dates =
        generateForecastDates(
            forecast.length
        );

    return forecast.map(
        (qty, index) => ({

            date:
                dates[index].date,

            day:
                dates[index].day,

            qty:
                Math.max(
                    0,
                    Math.round(qty)
                )

        })
    );
}