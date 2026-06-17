export function HoltWinters(

    series,

    horizon = 7,

    alpha = 0.3,

    beta = 0.1,

    gamma = 0.1,

    seasonLength = 7

) {

    if (
        !series ||
        series.length < seasonLength * 2
    ) {

        return {

            model: "Holt-Winters",

            fitted: [],

            forecast: [],

            nextValue: 0

        };

    }

    /*
    =====================
    INITIALIZATION
    =====================
    */

    const firstSeason =
        series.slice(
            0,
            seasonLength
        );

    const secondSeason =
        series.slice(
            seasonLength,
            seasonLength * 2
        );

    let level =

        firstSeason.reduce(
            (a, b) => a + b,
            0
        )

        / seasonLength;

    let trend = 0;

    for (
        let i = 0;
        i < seasonLength;
        i++
    ) {

        trend +=

            (
                secondSeason[i]
                -
                firstSeason[i]
            );

    }

    trend =

        trend

        / seasonLength

        / seasonLength;

    /*
    =====================
    ADDITIVE SEASONAL
    =====================
    */

    const seasonals = [];

    for (
        let i = 0;
        i < seasonLength;
        i++
    ) {

        seasonals[i] =

            firstSeason[i]

            -

            level;

    }

    const fitted = [];

    /*
    =====================
    TRAINING
    =====================
    */

    for (
        let i = 0;
        i < series.length;
        i++
    ) {

        const idx =
            i %
            seasonLength;

        const seasonal =
            seasonals[idx];

        const prevLevel =
            level;

        level =

            alpha *

            (
                series[i]
                -
                seasonal
            )

            +

            (

                1 - alpha

            )

            *

            (
                level
                +
                trend
            );

        trend =

            beta *

            (
                level
                -
                prevLevel
            )

            +

            (

                1 - beta

            )

            *

            trend;

        const fittedValue =

            level
            +
            trend
            +
            seasonal;

        fitted.push(

            Math.max(
                0,
                Number(
                    fittedValue.toFixed(2)
                )
            )

        );

        seasonals[idx] =

            gamma *

            (
                series[i]
                -
                level
            )

            +

            (

                1 - gamma

            )

            *

            seasonal;

    }

    /*
    =====================
    FORECAST
    =====================
    */

    const forecast = [];

    for (
        let h = 1;
        h <= horizon;
        h++
    ) {

        const idx =

            (
                series.length
                +
                h
                -
                1
            )

            %

            seasonLength;

        const value =

            level

            +

            (

                h
                *
                trend

            )

            +

            seasonals[idx];

        forecast.push(

            Math.max(

                0,

                Number(
                    value.toFixed(2)
                )

            )

        );

    }

    return {

        model:
            "Holt-Winters",

        fitted,

        forecast,

        nextValue:
            forecast[0]

    };

}