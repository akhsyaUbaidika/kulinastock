export default function RecommendationCard({
    recommendation
}) {
    return (
        <div className="bg-white border rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">
                Inventory Recommendation
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                <div>
                    <p className="text-gray-500 text-sm">
                        Current Stock
                    </p>

                    <h3 className="text-3xl font-bold">
                        {recommendation.current_stock}
                    </h3>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Predicted Need
                    </p>

                    <h3 className="text-3xl font-bold">
                        {recommendation.predicted_need}
                    </h3>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Suggested Restock
                    </p>

                    <h3 className="text-3xl font-bold text-orange-500">
                        {recommendation.suggested_restock}
                    </h3>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Status
                    </p>

                    <h3 className="text-3xl font-bold">
                        {recommendation.status}
                    </h3>
                </div>
            </div>
        </div>
    );
}