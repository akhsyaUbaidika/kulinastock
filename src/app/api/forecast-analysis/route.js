export async function POST(request) {

    return Response.json({
        data: {
            methods: [
                {
                    name: "SES",
                    mae: 10,
                    mape: 8,
                    rmse: 12
                },
                {
                    name: "Holt",
                    mae: 7,
                    mape: 5,
                    rmse: 9
                }
            ],

            best_method: {
                name: "Holt",
                mape: 5
            },

            predictions: [
                {
                    day: "Senin",
                    qty: 12
                },
                {
                    day: "Selasa",
                    qty: 15
                }
            ],

            recommendation: {
                current_stock: 20,
                predicted_need: 50,
                suggested_restock: 30,
                status: "RESTOCK"
            }
        }
    });
}