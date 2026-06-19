export default function RecommendationCardV2({
    result
}) {

    if (!result) {
        return null;
    }

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

            <div
                className="
grid
grid-cols-1
md:grid-cols-3
gap-6
"
            >

                <div>

                    <p className="text-blue-200">
                        Current Inventory
                    </p>

                    <p
                        className="
text-4xl
font-bold
"
                    >
                        {result.current_stock}
                    </p>

                </div>

                <div>

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

                </div>

                <div>

                    <p className="text-blue-200">
                        Suggested Replenishment
                    </p>

                    <p
                        className="
text-4xl
font-bold
"
                    >
                        {
                            result.suggested_restock
                        }
                    </p>

                </div>

            </div>

        </div>

    );

}