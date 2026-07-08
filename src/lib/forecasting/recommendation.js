export function generateRecommendation({

    currentStock,

    minimumStock,

    predictions,

    purchaseMultiple,
    qtyPerLargeUnit

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

    // const suggestedRestock =

    //     Math.max(

    //         0,

    //         targetStock -
    //         currentStock

    //     );

    const rawRestock =

        Math.max(

            0,

            targetStock -
            currentStock

        );

    const supplierOrderQty =

        Math.max(
            purchaseMultiple,
            1
        ) *

        Math.max(
            qtyPerLargeUnit,
            1
        );

    const suggestedRestock =

        rawRestock > 0

            ?

            Math.ceil(
                rawRestock /
                supplierOrderQty
            ) * supplierOrderQty

            :

            0;

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

        target_stock:
            targetStock,

        raw_restock:
            rawRestock,

        suggested_restock:
            suggestedRestock,

        purchase_multiple:
            purchaseMultiple,

        coverage_days:
            coverageDays,

        status
    };
}