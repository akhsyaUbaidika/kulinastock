export function Holt(

    series,

    horizon = 7,

    alpha = 0.3,

    beta = 0.1

) {

    if (
        !series ||
        series.length < 2
    ) {

        return {

            model:
                "Holt",

            fitted: [],

            forecast: [],

            nextValue: 0
        };
    }

    let level =
        series[0];

    let trend =
        series[1]
        -
        series[0];

    const fitted = [];

    for (
        let i = 1;
        i < series.length;
        i++
    ) {

        const prevLevel =
            level;

        level =

            alpha
            *
            series[i]

            +

            (
                1 - alpha
            )

            *

            (
                level +
                trend
            );

        trend =

            beta
            *

            (
                level -
                prevLevel
            )

            +

            (
                1 - beta
            )
            *
            trend;

        fitted.push(
            level +
            trend
        );
    }

    const forecast = [];

    for (
        let h = 1;
        h <= horizon;
        h++
    ) {

        // forecast.push(

        //     Number(

        //         (
        //             level
        //             +
        //             (
        //                 h *
        //                 trend
        //             )
        //         )

        //             .toFixed(2)

        //     )

        // );

        forecast.push(

            Math.max(

                0,

                Number(

                    (
                        level
                        +
                        (
                            h *
                            trend
                        )
                    )

                        .toFixed(2)

                )

            )

        );
    }

    return {

        model:
            "Holt",

        fitted,

        forecast,

        nextValue:
            forecast[0]
    };
}