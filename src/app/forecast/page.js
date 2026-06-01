"use client";

import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function ForecastPage() {
    const [forecast, setForecast] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const response = await fetch("/api/items");
            const result = await response.json();

            setItems(result.data || []);

            if (result.data && result.data.length > 0) {
                const firstItemId = result.data[0].id;

                setSelectedItem(firstItemId);

                await loadForecast(firstItemId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function loadForecast(itemId) {
        try {
            const response = await fetch(
                `/api/forecast?item_id=${itemId}&save=true`
            );

            const result = await response.json();

            setForecast(result);
        } catch (error) {
            console.error(error);
        }
    }

    if (!forecast) {
        return (
            <main className="p-8">
                Loading...
            </main>
        );
    }

    const chartData = forecast.historicalData.map(
        (value, index) => ({
            period: index + 1,
            actual: value,
            ses: forecast.sesForecast[index],
            holt: forecast.holtForecast[index],
            hw: forecast.hwForecast[index],
        })
    );

    chartData.push({
        period: chartData.length + 1,
        actual: null,
        ses: forecast.latestForecast.SES,
        holt: forecast.latestForecast.Holt,
        hw: forecast.latestForecast.HoltWinters,
    });

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-8">
                Forecast Analysis
            </h1>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Generate Forecast
                </h2>

                <div className="flex gap-4">
                    <select
                        className="border rounded p-2"
                        value={selectedItem}
                        onChange={(e) =>
                            setSelectedItem(e.target.value)
                        }
                    >
                        {items.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.item_name}
                            </option>
                        ))}
                    </select>

                    <button
                        className="border rounded px-4 py-2"
                        onClick={() =>
                            loadForecast(selectedItem)
                        }
                    >
                        Generate Forecast
                    </button>
                </div>
            </div>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Forecast Comparison Chart
                </h2>

                <div className="h-[500px]">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="period" />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="actual"
                                name="Historical"
                                stroke="#ffffff"
                                strokeWidth={3}
                            />

                            <Line
                                type="monotone"
                                dataKey="ses"
                                name="SES"
                                stroke="#ef4444"
                            />

                            <Line
                                type="monotone"
                                dataKey="holt"
                                name="Holt"
                                stroke="#f59e0b"
                            />

                            <Line
                                type="monotone"
                                dataKey="hw"
                                name="Holt-Winters"
                                stroke="#22c55e"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Accuracy Metrics
                </h2>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">
                                Method
                            </th>
                            <th className="text-left">
                                MAE
                            </th>
                            <th className="text-left">
                                MAPE
                            </th>
                            <th className="text-left">
                                RMSE
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>SES</td>
                            <td>
                                {forecast.metrics.SES.mae.toFixed(
                                    2
                                )}
                            </td>
                            <td>
                                {forecast.metrics.SES.mape.toFixed(
                                    2
                                )}
                                %
                            </td>
                            <td>
                                {forecast.metrics.SES.rmse.toFixed(
                                    2
                                )}
                            </td>
                        </tr>

                        <tr>
                            <td>Holt</td>
                            <td>
                                {forecast.metrics.Holt.mae.toFixed(
                                    2
                                )}
                            </td>
                            <td>
                                {forecast.metrics.Holt.mape.toFixed(
                                    2
                                )}
                                %
                            </td>
                            <td>
                                {forecast.metrics.Holt.rmse.toFixed(
                                    2
                                )}
                            </td>
                        </tr>

                        <tr>
                            <td>Holt-Winters</td>
                            <td>
                                {forecast.metrics.HoltWinters.mae.toFixed(
                                    2
                                )}
                            </td>
                            <td>
                                {forecast.metrics.HoltWinters.mape.toFixed(
                                    2
                                )}
                                %
                            </td>
                            <td>
                                {forecast.metrics.HoltWinters.rmse.toFixed(
                                    2
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Best Method
                </h2>

                <p className="text-2xl font-bold">
                    {forecast.bestMethod.method}
                </p>

                <p>
                    Forecast Value:{" "}
                    {forecast.forecastValue.toFixed(2)}
                </p>

                <p>
                    MAE:{" "}
                    {forecast.bestMethod.mae.toFixed(2)}
                </p>

                <p>
                    MAPE:{" "}
                    {forecast.bestMethod.mape.toFixed(2)}%
                </p>

                <p>
                    RMSE:{" "}
                    {forecast.bestMethod.rmse.toFixed(2)}
                </p>
            </div>
        </main>
    );
}