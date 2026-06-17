export function buildDiagnostic(

    datasetSummary,

    bestMethod

) {

    return {

        contains_zero_demand:

            datasetSummary.zero_count > 0,

        zero_count:

            datasetSummary.zero_count,

        seasonality_detected:

            true,

        season_length:

            7,

        recommended_method:

            bestMethod.name

    };

}