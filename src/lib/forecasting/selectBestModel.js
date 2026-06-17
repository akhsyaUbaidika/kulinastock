export function selectBestModel(
    methods
) {

    if (
        !methods ||
        methods.length === 0
    ) {
        return null;
    }

    const sorted =
        [...methods]

            .sort((a, b) => {

                if (
                    a.mape !==
                    b.mape
                ) {

                    return (
                        a.mape -
                        b.mape
                    );
                }

                if (
                    a.rmse !==
                    b.rmse
                ) {

                    return (
                        a.rmse -
                        b.rmse
                    );
                }

                return (
                    a.mae -
                    b.mae
                );

            });

    return sorted[0];
}