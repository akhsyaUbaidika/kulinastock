export function buildRanking(
    methods
) {

    return [

        ...methods

    ]

        .sort(

            (a, b) =>

                a.mape
                -
                b.mape

        )

        .map(

            (
                method,
                index
            ) => ({

                rank:
                    index + 1,

                method:
                    method.name,

                mae:
                    method.mae,

                mape:
                    method.mape,

                rmse:
                    method.rmse

            })

        );

}