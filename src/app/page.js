"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [forecastResults, setForecastResults] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const itemsRes = await fetch("/api/items");
      const itemsData = await itemsRes.json();

      const historyRes = await fetch("/api/history");
      const historyData = await historyRes.json();

      const forecastRes = await fetch("/api/forecast-results");
      const forecastData = await forecastRes.json();

      setItems(itemsData.data || []);
      setHistory(historyData.data || []);
      setForecastResults(forecastData.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  const latestForecast =
    forecastResults.length > 0
      ? forecastResults[0]
      : null;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">
        KulinaStock Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">
            Total Items
          </h2>
          <p className="text-3xl font-bold">
            {items.length}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">
            Historical Records
          </h2>
          <p className="text-3xl font-bold">
            {history.length}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">
            Forecast Results
          </h2>
          <p className="text-3xl font-bold">
            {forecastResults.length}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">
            Best Method
          </h2>

          <p className="text-xl font-bold">
            {latestForecast?.method ??
              "-"}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Latest Forecast
        </h2>

        {latestForecast ? (
          <div className="space-y-2">
            <p>
              Item :
              {" "}
              {latestForecast.items?.item_name}
            </p>

            <p>
              Method :
              {" "}
              {latestForecast.method}
            </p>

            <p>
              Forecast :
              {" "}
              {Number(
                latestForecast.forecast_value
              ).toFixed(2)}
            </p>

            <p>
              MAPE :
              {" "}
              {Number(
                latestForecast.mape
              ).toFixed(2)}
              %
            </p>

            <p>
              MAE :
              {" "}
              {Number(
                latestForecast.mae
              ).toFixed(2)}
            </p>

            <p>
              RMSE :
              {" "}
              {Number(
                latestForecast.rmse
              ).toFixed(2)}
            </p>
          </div>
        ) : (
          <p>No forecast data found.</p>
        )}
      </div>
    </main>
  );
}