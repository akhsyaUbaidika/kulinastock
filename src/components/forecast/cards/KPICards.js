export default function KPICards({ result }) {

    const item = result?.item;
    const best = result?.best_method;
    const config = result?.analysis_config;

    const cards = [
        {
            label: "Current Stock",
            value: `${item?.current_stock ?? 0} ${item?.small_unit ?? ""}`,
        },
        {
            label: "Minimum Stock",
            value: `${item?.minimum_stock ?? 0} ${item?.small_unit ?? ""}`,
        },
        {
            label: "Best Method",
            value: best?.name ?? "-",
        },
        {
            label: "MAPE",
            value: `${best?.mape ?? 0}%`,
        },
        {
            label: "Forecast Horizon",
            value: `D+${config?.horizon ?? 0}`,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

            {cards.map((card) => (
                <div
                    key={card.label}
                    className="
bg-white
rounded-[28px]
border
border-slate-200
shadow-sm
p-6
"
                >
                    <p className="
text-sm
text-slate-500
mb-2
">
                        {card.label}
                    </p>

                    <h3 className="
text-2xl
font-bold
text-[#0B132B]
">
                        {card.value}
                    </h3>
                </div>
            ))}

        </div>
    );
}