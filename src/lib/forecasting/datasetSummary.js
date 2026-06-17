export function generateDatasetSummary(
    dataset
) {

    if (
        !dataset ||
        dataset.length === 0
    ) {

        return {

            total_observations: 0,
            average_demand: 0,
            min_demand: 0,
            max_demand: 0,

            zero_count: 0,
            zero_percentage: 0,

            seasonality: "UNKNOWN",

            start_date: null,
            end_date: null,

            readiness:
                "NOT READY"
        };
    }

    const demands =
        dataset.map(
            x => x.demand
        );

    const average =

        demands.reduce(
            (a, b) => a + b,
            0
        ) / demands.length;

    const zeroCount =

        demands.filter(
            x => x === 0
        ).length;

    const zeroPercentage =

        Number(

            (
                zeroCount
                /
                demands.length
            )

            * 100

        ).toFixed(2);

    let readiness =
        "NOT READY";

    if (
        dataset.length >= 60
    ) {

        readiness =
            "READY";

    }

    else if (
        dataset.length >= 30
    ) {

        readiness =
            "FAIR";

    }

    return {

        total_observations:
            dataset.length,

        average_demand:
            Number(
                average.toFixed(2)
            ),

        min_demand:
            Math.min(
                ...demands
            ),

        max_demand:
            Math.max(
                ...demands
            ),

        zero_count:
            zeroCount,

        zero_percentage:
            zeroPercentage,

        seasonality:
            "WEEKLY",

        start_date:
            dataset[0].date,

        end_date:
            dataset[
                dataset.length - 1
            ].date,

        readiness
    };
}