export default function DataHealthNotice({
    health
}) {

    if (!health) return null;

    const statusConfig = {

        READY: {
            title: "Dataset Ready",
            icon: "✓",
            className:
                "bg-green-50 border-green-200 text-green-900"
        },

        INCOMPLETE_DATA: {
            title: "Dataset Incomplete",
            icon: "⚠",
            className:
                "bg-yellow-50 border-yellow-200 text-yellow-900"
        },

        NO_TRANSACTIONS: {
            title: "No Transactions Found",
            icon: "✕",
            className:
                "bg-red-50 border-red-200 text-red-900"
        },

        INSUFFICIENT_HISTORY: {
            title: "Insufficient History",
            icon: "⚠",
            className:
                "bg-orange-50 border-orange-200 text-orange-900"
        }

    };

    const config =
        statusConfig[
        health.status
        ] ||
        statusConfig.READY;

    return (

        <div className={`
    rounded-3xl
    border
    p-6
    mb-6
    ${config.className}
`}>

            <div className="flex items-center gap-3 mb-4">

                <span className="text-2xl">
                    {config.icon}
                </span>

                <h3 className="text-lg font-bold">
                    {config.title}
                </h3>

            </div>

            <div className="space-y-2 text-sm">

                {
                    health.last_transaction_date && (
                        <p>
                            Last transaction:
                            {" "}
                            <strong>
                                {
                                    health.last_transaction_date
                                }
                            </strong>
                        </p>
                    )
                }

                {
                    health.forecast_start_date && (
                        <p>
                            Forecast starts:
                            {" "}
                            <strong>
                                {
                                    health.forecast_start_date
                                }
                            </strong>
                        </p>
                    )
                }

                {
                    health.missing_days > 0 && (
                        <p>
                            Missing days:
                            {" "}
                            <strong>
                                {
                                    health.missing_days
                                }
                            </strong>
                        </p>
                    )
                }

                {
                    health.observation_count && (
                        <p>
                            Observations:
                            {" "}
                            <strong>
                                {
                                    health.observation_count
                                }
                            </strong>

                            {" / "}

                            {
                                health.minimum_required
                            }
                        </p>
                    )
                }

            </div>

        </div>

    );

}