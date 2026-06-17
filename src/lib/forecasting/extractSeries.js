export function extractSeries(
    dataset
) {

    if (!dataset) {
        return [];
    }

    return dataset.map(
        row =>
            Number(
                row.demand
            )
    );
}