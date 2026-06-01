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
            {
              items.length
            }
          </p>

        </div>

        <div className="border rounded-lg p-4">

          <h2 className="text-sm text-gray-500">
            Historical Records
          </h2>

          <p className="text-3xl font-bold">
            {
              history.length
            }
          </p>

        </div>

        <div className="border rounded-lg p-4">

          <h2 className="text-sm text-gray-500">
            Forecast Results
          </h2>

          <p className="text-3xl font-bold">
            {
              forecastResults.length
            }
          </p>

        </div>

        <div className="border rounded-lg p-4">

          <h2 className="text-sm text-gray-500">

            Latest Method

          </h2>

          <p className="text-xl font-bold">

            {
              latestForecast
                ?.method
              ||
              "-"
            }

          </p>

        </div>

      </div>

      <div className="border rounded-lg p-6">

        <h2 className="text-xl font-semibold mb-6">

          Latest Forecast

        </h2>

        {
          latestForecast

            ?

            (
              <>

                <div className="space-y-3">

                  <p>

                    Item:

                    {" "}

                    {
                      latestForecast
                        .items
                        ?.item_name
                    }

                  </p>

                  <p>

                    Method:

                    {" "}

                    {
                      latestForecast
                        .method
                    }

                  </p>

                  <p>

                    Forecast:

                    {" "}

                    {
                      Number(
                        latestForecast
                          .forecast_value
                      )
                        .toFixed(
                          2
                        )
                    }

                  </p>

                  <p>

                    MAPE:

                    {" "}

                    {
                      Number(
                        latestForecast
                          .mape
                      )
                        .toFixed(
                          2
                        )
                    }

                    %

                  </p>

                  <p>

                    MAE:

                    {" "}

                    {
                      Number(
                        latestForecast
                          .mae
                      )
                        .toFixed(
                          2
                        )
                    }

                  </p>

                  <p>

                    RMSE:

                    {" "}

                    {
                      Number(
                        latestForecast
                          .rmse
                      )
                        .toFixed(
                          2
                        )
                    }

                  </p>

                </div>

                {
                  bestForecast
                  &&

                  (

                    <div className="mt-8 pt-6 border-t">

                      <h3 className="text-lg font-semibold mb-4">

                        Best Accuracy

                      </h3>

                      <p>

                        Item:

                        {" "}

                        {
                          bestForecast
                            .items
                            ?.item_name
                        }

                      </p>

                      <p>

                        Method:

                        {" "}

                        {
                          bestForecast
                            .method
                        }

                      </p>

                      <p>

                        MAPE:

                        {" "}

                        {
                          Number(
                            bestForecast
                              .mape
                          )
                            .toFixed(
                              2
                            )
                        }

                        %

                        {" "}

                        {
                          getMAPEBadge(
                            bestForecast
                              .mape
                          )
                        }

                      </p>

                    </div>

                  )
                }

              </>
            )

            :

            (

              <p>

                No forecast data

              </p>

            )
        }

      </div>

      <div className="border rounded-lg p-6 mt-8">

        <h2 className="text-xl font-semibold mb-6">

          Recent Forecast Results

        </h2>

        <div className="space-y-4">

          {
            forecastResults
              .slice(
                0,
                5
              )
              .map(
                (
                  row
                ) => (

                  <div
                    key={
                      row.id
                    }
                    className="
                                        border-b
                                        pb-4
                                        "
                  >

                    <p>

                      <b>

                        {
                          row
                            .items
                            ?.item_name
                        }

                      </b>

                    </p>

                    <p>

                      {
                        row.method
                      }

                    </p>

                    <p>

                      MAPE:

                      {" "}

                      {
                        Number(
                          row.mape
                        )
                          .toFixed(
                            2
                          )
                      }

                      %

                    </p>

                    <p>

                      MAE:

                      {" "}

                      {
                        Number(
                          row.mae
                        )
                          .toFixed(
                            2
                          )
                      }

                    </p>

                    <p>

                      RMSE:

                      {" "}

                      {
                        Number(
                          row.rmse
                        )
                          .toFixed(
                            2
                          )
                      }

                    </p>

                  </div>
                )
              )
          }

        </div>

      </div>

      <div className="border rounded-lg p-6 mt-8">

        <h2 className="text-xl font-semibold mb-6">

          Low Stock Alert

        </h2>

        {
          lowStock.length

            ?

            lowStock.map(
              (
                item
              ) => (

                <div
                  key={
                    item.id
                  }
                  className="mb-3"
                >

                  ⚠

                  {" "}

                  {
                    item.item_name
                  }

                  —

                  Stock:

                  {" "}

                  {
                    item.current_stock
                  }

                  —

                  {" "}

                  {
                    getStockStatus(
                      item.current_stock
                    )
                  }

                </div>
              )
            )

            :

            (

              <p>

                ✅ All stock healthy

              </p>

            )
        }

      </div>

    </main>
  );
}