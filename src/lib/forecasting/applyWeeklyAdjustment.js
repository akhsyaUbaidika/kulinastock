export function applyWeeklyAdjustment(

    predictions,

    weeklyPattern

) {

    if (

        !weeklyPattern?.enabled

    ) {

        return predictions;

    }

    return predictions.map(

        prediction => {

            const factor =

                weeklyPattern
                    .factors?.[
                prediction.day
                ]

                ||

                1;

            return {

                ...prediction,

                base_qty:

                    prediction.qty,

                factor,

                qty:

                    Math.round(

                        prediction.qty
                        *
                        factor

                    )

            };

        }

    );

}