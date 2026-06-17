export function SES(

    series,

    horizon = 7,

    alpha = 0.3

) {

    if (
        !series ||
        series.length === 0
    ) {

        return {

            model: "SES",

            fitted: [],

            forecast: [],

            nextValue: 0

        };
    }

    const fitted = [];

    fitted[0] = series[0];

    for (
        let i = 1;
        i < series.length;
        i++
    ) {

        fitted[i] =

            alpha *
            series[i - 1]

            +

            (1 - alpha)
            *
            fitted[i - 1];

    }

    const lastForecast =

        fitted[
        fitted.length - 1
        ];

    const forecast =

        Array(horizon)

            .fill(

                Number(
                    lastForecast
                        .toFixed(2)
                )

            );

    return {

        model:
            "SES",

        fitted,

        forecast,

        nextValue:
            forecast[0]

    };
}