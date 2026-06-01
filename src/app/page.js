"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [forecastResults, setForecastResults] =
    useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const itemsRes =
        await fetch(
          "/api/items"
        );

      const itemsData =
        await itemsRes.json();

      const historyRes =
        await fetch(
          "/api/history"
        );

      const historyData =
        await historyRes.json();

      const forecastRes =
        await fetch(
          "/api/forecast-results"
        );

      const forecastData =
        await forecastRes.json();

      setItems(
        itemsData.data ||
        []
      );

      setHistory(
        historyData.data ||
        []
      );

      setForecastResults(
        forecastData.data ||
        []
      );

    } catch (error) {
      console.error(error);
    }
  }

  const latestForecast =
    forecastResults.length
      ? forecastResults[0]
      : null;

  const bestForecast =
    forecastResults.length
      ?

      forecastResults.reduce(
        (
          best,
          curr
        ) =>

          curr.mape
            <
            best.mape

            ?

            curr

            :

            best
      )

      :

      null;

  const lowStock =
    items.filter(
      (
        item
      ) =>

        item.current_stock
        <
        20
    );

  function getMAPEBadge(
    value
  ) {

    if (
      value <
      10
    ) {
      return "🟢";
    }

    if (
      value <
      20
    ) {
      return "🟡";
    }

    return "🔴";
  }

  function getStockStatus(
    value
  ) {

    if (
      value <
      10
    ) {
      return "🔴 Critical";
    }

    return "🟡 Low";
  }

  return (
    <main className="min-h-screen px-10 py-8">

      <div className="mb-10">
        <h1 className="text-[58px] font-bold tracking-[-2px] text-slate-900">
          KulinaStock Dashboard
        </h1>

        <p className="text-slate-500 text-lg mt-2">
          Inventory forecasting and stock monitoring overview.
        </p>
      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

        {[
          {
            label: "Total Items",
            value: items.length,
          },
          {
            label: "Historical Records",
            value: history.length,
          },
          {
            label: "Forecast Results",
            value: forecastResults.length,
          },
          {
            label: "Latest Method",
            value: latestForecast?.method || "-",
          },
        ].map((card) => (

          <div
            key={card.label}
            className="
bg-white
rounded-3xl
p-6
shadow-sm
border
border-slate-200
hover:shadow-lg
transition
"
          >

            <p className="text-slate-500 text-sm mb-2">
              {card.label}
            </p>

            <p className="text-[42px] font-bold text-slate-900">
              {card.value}
            </p>

          </div>

        ))}

      </div>


      {/* FORECAST */}

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mb-10">

        <div
          className="
bg-white
rounded-[32px]
p-8
border
shadow-sm
"
        >

          <h2 className="text-3xl font-bold mb-8">
            Latest Forecast
          </h2>

          {
            latestForecast
              ?

              <>

                <div className="mb-6">

                  <div className="text-slate-500 mb-2">
                    Item
                  </div>

                  <div className="text-[40px] font-bold">
                    {latestForecast.items?.item_name}
                  </div>

                </div>


                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="text-slate-500">
                      Method
                    </div>

                    <div className="text-2xl font-semibold">
                      {latestForecast.method}
                    </div>
                  </div>


                  <div className="rounded-2xl bg-blue-600 text-white p-5">

                    <div className="text-blue-100">
                      Forecast
                    </div>

                    <div className="text-4xl font-bold">

                      {
                        Number(
                          latestForecast.forecast_value
                        ).toFixed(2)
                      }

                    </div>

                  </div>


                  <div className="rounded-2xl border p-5">

                    <div className="text-slate-500">
                      MAPE
                    </div>

                    <div className="text-3xl font-bold">

                      {
                        Number(
                          latestForecast.mape
                        ).toFixed(2)
                      }%

                    </div>

                  </div>


                  <div className="rounded-2xl border p-5">

                    <div className="text-slate-500">
                      MAE
                    </div>

                    <div className="text-3xl font-bold">

                      {
                        Number(
                          latestForecast.mae
                        ).toFixed(2)
                      }

                    </div>

                  </div>

                </div>

              </>

              :

              <div className="text-slate-500">
                No forecast data
              </div>

          }

        </div>


        {/* SIDE */}

        <div className="space-y-5">

          {
            bestForecast && (

              <div
                className="
rounded-[32px]
bg-gradient-to-br
from-blue-600
to-indigo-700
text-white
p-8
shadow-xl
"
              >

                <div className="text-blue-100 mb-3">
                  BEST ACCURACY
                </div>

                <div className="text-4xl font-bold leading-tight">

                  {
                    bestForecast.items?.item_name
                  }

                </div>

                <div className="mt-5">

                  <div className="text-blue-100">
                    MAPE
                  </div>

                  <div className="text-5xl font-bold">

                    {
                      Number(
                        bestForecast.mape
                      ).toFixed(2)
                    }%

                  </div>

                </div>

                <div className="mt-3 text-blue-100">
                  {
                    getMAPEBadge(
                      bestForecast.mape
                    )
                  }
                </div>

              </div>

            )
          }


          <div
            className="
bg-white
rounded-[32px]
border
p-8
"
          >

            <h3 className="text-2xl font-bold mb-6">
              Low Stock Alert
            </h3>

            {
              lowStock.length

                ?

                <div className="space-y-4">

                  {
                    lowStock.map((item) => (

                      <div
                        key={item.id}
                        className="
rounded-2xl
bg-red-50
border
border-red-100
p-4
"
                      >

                        <div className="font-semibold">
                          {item.item_name}
                        </div>

                        <div className="text-slate-500">

                          Stock:
                          {" "}
                          {item.current_stock}

                        </div>

                      </div>

                    ))
                  }

                </div>

                :

                <div className="text-green-600">
                  ✓ All stock healthy
                </div>

            }

          </div>

        </div>

      </div>


      {/* RECENT */}

      <div
        className="
bg-white
rounded-[32px]
border
p-8
"
      >

        <h2 className="text-3xl font-bold mb-8">
          Recent Forecast Results
        </h2>

        <div className="space-y-4">

          {
            forecastResults
              .slice(0, 5)
              .map((row) => (

                <div
                  key={row.id}
                  className="
flex
justify-between
items-center
rounded-2xl
border
p-6
hover:bg-slate-50
transition
"
                >

                  <div>

                    <div className="font-bold text-lg">
                      {row.items?.item_name}
                    </div>

                    <div className="text-slate-500">
                      {row.method}
                    </div>

                  </div>

                  <div className="text-right">

                    <div className="text-blue-600 text-3xl font-bold">

                      {
                        Number(
                          row.mape
                        ).toFixed(2)
                      }%

                    </div>

                    <div className="text-slate-500">
                      MAPE
                    </div>

                  </div>

                </div>

              ))
          }

        </div>

      </div>

    </main>
  );
}