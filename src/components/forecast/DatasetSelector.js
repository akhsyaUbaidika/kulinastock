"use client";

export default function DatasetSelector({
    items,
    selectedItem,
    setSelectedItem,
    horizon,
    setHorizon,
    splitRatio,
    setSplitRatio,
    onRunAnalysis
}) {
    return (
        <div className="bg-white border rounded-3xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Pilih Item
                    </label>

                    <select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        <option value="">Select Item</option>

                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.item_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Horizon Prediksi
                    </label>

                    <select
                        value={horizon}
                        onChange={(e) => setHorizon(Number(e.target.value))}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        <option value={3}>D+3</option>
                        <option value={5}>D+5</option>
                        <option value={7}>D+7</option>
                        <option value={14}>D+14</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Training Split
                    </label>

                    <select
                        value={splitRatio}
                        onChange={(e) => setSplitRatio(Number(e.target.value))}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        <option value={70}>70 / 30</option>
                        <option value={80}>80 / 20</option>
                        <option value={90}>90 / 10</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={onRunAnalysis}
                        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold"
                    >
                        Run Analysis
                    </button>
                </div>
            </div>
        </div>
    );
}