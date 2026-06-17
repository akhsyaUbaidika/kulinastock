export function fillMissingDates(
    dataset
) {

    if (
        !dataset ||
        dataset.length === 0
    ) {

        return [];
    }

    const result = [];

    const startDate =
        new Date(
            dataset[0].date
        );

    const endDate =
        new Date(
            dataset[
                dataset.length - 1
            ].date
        );

    const demandMap =
        new Map();

    dataset.forEach(
        row => {

            demandMap.set(
                row.date,
                row.demand
            );

        }
    );

    const current =
        new Date(
            startDate
        );

    while (
        current <= endDate
    ) {

        const dateString =
            current
                .toISOString()
                .split("T")[0];

        result.push({

            date:
                dateString,

            demand:

                demandMap.has(
                    dateString
                )

                    ? demandMap.get(
                        dateString
                    )

                    : 0

        });

        current.setDate(
            current.getDate() + 1
        );

    }

    return result;

}