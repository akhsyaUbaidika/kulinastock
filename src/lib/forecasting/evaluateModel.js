import {
    MAE,
    MAPE,
    RMSE
}
    from "./metrics";

export function evaluateModel({

    name,

    actual,

    fitted

}) {
    if (!actual || !fitted) {

        return {

            name,

            mae: 999,

            mape: 999,

            rmse: 999

        };

    }

    const size =

        Math.min(
            actual.length,
            fitted.length
        );

    const actualSlice =
        actual.slice(
            actual.length - size
        );

    const fittedSlice =
        fitted.slice(
            fitted.length - size
        );

    return {

        name,

        mae:

            Number(

                MAE(
                    actualSlice,
                    fittedSlice
                )

                    .toFixed(2)

            ),

        mape:

            Number(

                MAPE(
                    actualSlice,
                    fittedSlice
                )

                    .toFixed(2)

            ),

        rmse:

            Number(

                RMSE(
                    actualSlice,
                    fittedSlice
                )

                    .toFixed(2)

            )
    };
}