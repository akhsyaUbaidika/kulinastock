import {
    fillMissingDates
}
    from "./fillMissingDates";

export function aggregateDemand(transactions) {

    if (!transactions || transactions.length === 0) {
        return [];
    }

    const grouped = {};

    transactions.forEach((row) => {

        if (row.transaction_type !== "OUT") {
            return;
        }

        const date = row.transaction_date;

        if (!grouped[date]) {
            grouped[date] = 0;
        }

        grouped[date] += Number(row.qty);
    });

    const aggregated =
        Object.entries(grouped)

            .map(
                ([date, demand]) => ({

                    date,

                    demand

                })
            )

            .sort(

                (a, b) =>

                    new Date(a.date)

                    -

                    new Date(b.date)

            );

    return fillMissingDates(
        aggregated
    );
}