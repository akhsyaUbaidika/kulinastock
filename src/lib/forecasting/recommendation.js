export function generateRecommendation({

    currentStock,

    minimumStock,

    predictions

}) {

    const predictedNeed =

        predictions.reduce(

            (
                total,
                item
            ) =>

                total +
                Number(
                    item.qty
                ),

            0

        );

    const targetStock =

        predictedNeed +
        minimumStock;

    const suggestedRestock =

        Math.max(

            0,

            targetStock -
            currentStock

        );

    const status =

        suggestedRestock > 0

            ? "RESTOCK"

            : "SUFFICIENT";

    const averageDailyDemand =

        predictedNeed /

        Math.max(
            predictions.length,
            1
        );

    const coverageDays =

        averageDailyDemand > 0

            ?

            Number(

                (
                    currentStock
                    /
                    averageDailyDemand
                )

                    .toFixed(1)

            )

            : 0;

    return {

        current_stock:
            currentStock,

        minimum_stock:
            minimumStock,

        predicted_need:
            predictedNeed,

        suggested_restock:
            suggestedRestock,

        coverage_days:
            coverageDays,

        status
    };
}