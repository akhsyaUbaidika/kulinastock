export function buildExplanation(

    bestMethod,

    datasetSummary

) {

    return {

        summary:

            `${bestMethod.name} dipilih karena menghasilkan error terendah dan stabil terhadap karakteristik dataset.`,

        statistical_reason:

            `${bestMethod.name} memiliki nilai MAPE ${bestMethod.mape}% dan RMSE ${bestMethod.rmse}.`,

        business_reason:

            datasetSummary.zero_count > 0

                ?

                "Dataset mengandung demand nol sehingga metode sederhana lebih robust terhadap data intermittent."

                :

                "Dataset menunjukkan pola demand yang stabil."

    };

}