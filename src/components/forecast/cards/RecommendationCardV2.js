export default function RecommendationCardV2({
    result,
    item
}) {

    if (!result) {
        return null;
    }
    const purchaseQty =
        (item?.qty_per_large_unit || 1) *
        (result?.purchase_multiple || 1);

    const suggestedLargeUnit =
        purchaseQty > 0
            ? Math.ceil(
                result?.suggested_restock /
                item?.qty_per_large_unit
            )
            : 0;

    //     const suggestedLargeUnit =
    // item.qty_per_large_unit > 0
    //     ? result.suggested_restock /
    //       item.qty_per_large_unit
    //     : result.suggested_restock;

    const gridClass =
        result.status === "RESTOCK"
            ? "grid-cols-3"
            : "grid-cols-3";

    return (

        <div
            className="
bg-gradient-to-br
from-blue-600
to-blue-800
text-white
rounded-[32px]
shadow-lg
p-8
mb-8
"
        >

            <p
                className="
uppercase
tracking-[0.25em]
text-blue-100
text-xs
font-semibold
mb-2
"
            >
                Final Recommendation
            </p>

            <h2
                className="
text-3xl
font-bold
mb-8
"
            >
                Inventory Assessment
            </h2>

            <div className={`
    grid
    ${gridClass}
    gap-8
`}
            >

                {/* <div>

                    <p className="text-blue-200">
                        Current Stock
                    </p>

                    <p className="text-4xl font-bold">
                        {result.current_stock}
                    </p>

                    <p className="text-sm text-blue-200">
                        {item.small_unit}
                    </p>
                </div> */}

                <div>
                    <p className="text-blue-200">
                        Forecast Need
                    </p>

                    <p className="text-4xl font-bold">
                        {result.predicted_need}
                    </p>

                    <p className="text-sm text-blue-200">
                        {item.small_unit}
                    </p>
                </div>

                {/* <div>

                    <p className="text-blue-200">
                        Safety Stock
                    </p>

                    <p
                        className="
text-4xl
font-bold
"
                    >
                        {result.minimum_stock}
                    </p>

                </div> */}

                {
                    result.status === "RESTOCK"
                        ? (
                            <div>

                                <p className="text-blue-200">
                                    Required Quantity
                                </p>

                                <p className="text-4xl font-bold">
                                    {result.raw_restock}
                                </p>

                                <p className="text-sm text-blue-200">
                                    {item.small_unit}
                                </p>

                            </div>
                        )
                        : (
                            <div>

                                <p className="text-blue-200">
                                    Coverage Days
                                </p>

                                <p className="text-4xl font-bold">
                                    {result.coverage_days}
                                </p>

                                <p className="text-sm text-blue-200">
                                    days
                                </p>

                            </div>
                        )
                }

                {
                    result.status === "RESTOCK"
                        ? (
                            <div>

                                <p className="text-blue-200">
                                    Suggested Purchase
                                </p>

                                <p className="text-4xl font-bold">
                                    {suggestedLargeUnit}
                                </p>

                                <p className="text-sm text-blue-200">
                                    {item.large_unit}
                                </p>

                                <p className="text-xs text-blue-300 mt-2">
                                    ({result.suggested_restock} {item.small_unit})
                                </p>

                            </div>
                        )
                        : (
                            <div>

                                <p className="text-blue-200">
                                    Inventory Status
                                </p>

                                <p className="
text-2xl
font-bold
text-green-200
">
                                    SAFE
                                </p>

                                <p className="text-sm text-blue-200">
                                    No action required
                                </p>

                            </div>
                        )
                }
                {
                    result.status === "RESTOCK" && (
                        <div className="
            mt-6
            rounded-xl
            bg-white/10
            p-4
            border
            border-white/20
        ">
                            <p className="text-sm uppercase tracking-wider text-blue-200">
                                Purchase Rule
                            </p>

                            <p className="text-xl font-bold mt-2">
                                {result.purchase_multiple} {item.large_unit}
                            </p>

                            <p className="text-blue-100 mt-1">
                                per order
                            </p>

                            <p className="text-sm text-blue-200 mt-3">
                                Equivalent to {" "}
                                {result.purchase_multiple * item.qty_per_large_unit}
                                {" "}
                                {item.small_unit}
                            </p>
                        </div>
                    )
                }
            </div>
            <div className="mt-8 border-t border-white/20 pt-6">

                {
                    result.status === "SUFFICIENT"
                        ? (
                            <div>

                                <p className="text-lg font-semibold text-green-200">
                                    Inventory Status: Sufficient
                                </p>

                                <p className="text-blue-100 mt-2">
                                    Current inventory is sufficient to cover
                                    forecast demand and safety stock.
                                    No replenishment required.
                                </p>

                            </div>
                        )
                        : (
                            <div>

                                <p className="text-lg font-semibold text-yellow-200">
                                    Inventory Status: Restock Required
                                </p>

                                <p className="text-blue-100 mt-2">
                                    Additional inventory is required
                                    to satisfy forecast demand and
                                    maintain safety stock levels.
                                </p>

                            </div>
                        )
                }

            </div>
        </div>

    );

}