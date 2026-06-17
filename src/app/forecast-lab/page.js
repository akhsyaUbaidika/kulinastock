"use client";

import { useEffect, useState } from "react";

import DatasetSelector from "@/components/forecast/DatasetSelector";
import HistoricalDatasetTable from "@/components/forecast/HistoricalDatasetTable";
import MethodEvaluationTable from "@/components/forecast/MethodEvaluationTable";
import PredictionTable from "@/components/forecast/PredictionTable";
import RecommendationCard from "@/components/forecast/RecommendationCard";
import KPICards
    from "@/components/forecast/cards/KPICards";
import DatasetSummaryCard
    from "@/components/forecast/cards/DatasetSummaryCard";
import HistoricalChart
    from "@/components/forecast/charts/HistoricalChart";
import ForecastChart
    from "@/components/forecast/charts/ForecastChart";
import MethodRankingTable
    from "@/components/forecast/tables/MethodRankingTable";
import BestMethodCard
    from "@/components/forecast/cards/BestMethodCard";
import WeeklyHeatmap
    from "@/components/forecast/charts/WeeklyHeatmap";
import ExplanationCard
    from "@/components/forecast/cards/ExplanationCard";
import DiagnosticCard
    from "@/components/forecast/cards/DiagnosticCard";
import RecommendationCardV2
    from "@/components/forecast/cards/RecommendationCardV2";

export default function ForecastLabPage() {

    const [items, setItems] = useState([]);

    const [selectedItem, setSelectedItem] = useState("");
    const [horizon, setHorizon] = useState(3);
    const [splitRatio, setSplitRatio] = useState(80);

    const [historyData, setHistoryData] = useState([]);

    const [forecastResult, setForecastResult] =
        useState(null);

    const [page, setPage] =
        useState(1);

    const PAGE_SIZE = 5;

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            fetchHistory();
        }
    }, [selectedItem]);

    async function fetchItems() {

        const response =
            await fetch("/api/items");

        const result =
            await response.json();

        setItems(result.data || []);
    }

    async function fetchHistory() {

        const response =
            await fetch(
                `/api/history?item_id=${selectedItem}`
            );

        const result =
            await response.json();

        const outHistory =
            (result.data || []).filter(
                row =>
                    row.transaction_type === "OUT"
            );

        setHistoryData(outHistory);
    }

    async function runAnalysis() {

        if (!selectedItem) {
            alert("Select item first");
            return;
        }

        const response =
            await fetch(
                "/api/forecast-analysis",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        item_id: selectedItem,
                        horizon,
                        split_ratio: splitRatio
                    })
                }
            );

        const result =
            await response.json();

        setForecastResult(result);
    }

    /*
=========================
PAGINATION
=========================
*/

    const paginatedHistory =
        historyData.slice(

            (page - 1)
            * PAGE_SIZE,

            page
            * PAGE_SIZE

        );

    const totalPages =
        Math.ceil(
            historyData.length
            / PAGE_SIZE
        );

    return (
        <main className="
min-h-screen
px-8
py-8
">


            <div className="mb-8">
                <div
                    className="
rounded-[32px]
bg-gradient-to-br
from-white
to-blue-50
border
border-slate-200/60
p-10
"
                >
                    <p className="uppercase tracking-[0.3em] text-blue-500 text-sm">
                        Forecast Analysis Workspace
                    </p>

                    <h1 className="text-7xl font-bold mb-4">
                        Forecast Lab
                    </h1>

                    <p className="text-2xl text-gray-500">
                        Analyst forecasting workspace.
                    </p>
                </div>
            </div>
            <div className="space-y-8">

                <DatasetSelector
                    items={items}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    horizon={horizon}
                    setHorizon={setHorizon}
                    splitRatio={splitRatio}
                    setSplitRatio={setSplitRatio}
                    onRunAnalysis={runAnalysis}
                />

                {/* <HistoricalDatasetTable
                data={historyData}
            /> */}

                <HistoricalDatasetTable
                    data={paginatedHistory}
                />

                {/* PAGINATION */}

                {
                    historyData.length > 0 && (

                        <div
                            className="
flex
items-center
justify-between
mt-4
mb-8
"
                        >

                            <div
                                className="
text-sm
text-slate-500
"
                            >

                                Page {page} of {totalPages || 1}

                            </div>

                            <div className="flex gap-3">

                                <button
                                    disabled={
                                        page === 1
                                    }
                                    onClick={() =>
                                        setPage(
                                            page - 1
                                        )
                                    }
                                    className="
btn-secondary
"
                                >

                                    Previous

                                </button>

                                <button
                                    disabled={
                                        page === totalPages
                                        ||
                                        totalPages === 0
                                    }
                                    onClick={() =>
                                        setPage(
                                            page + 1
                                        )
                                    }
                                    className="
btn-primary
"
                                >

                                    Next

                                </button>

                            </div>

                        </div>

                    )
                }

                {forecastResult && (
                    <>
                        <KPICards
                            result={forecastResult}
                        />
                        <RecommendationCardV2
                            result={
                                forecastResult.recommendation
                            }
                        />
                        <DatasetSummaryCard
                            summary={
                                forecastResult.dataset_summary
                            }
                        />
                        <HistoricalChart
                            data={
                                forecastResult.historical_series
                            }
                        />
                        <ForecastChart
                            historical={
                                forecastResult.historical_series
                            }
                            predictions={
                                forecastResult.predictions
                            }
                            adjusted={
                                forecastResult.adjusted_predictions
                            }
                        />
                        <MethodRankingTable
                            ranking={
                                forecastResult.ranking
                            }
                        />
                        <BestMethodCard
                            method={
                                forecastResult.best_method
                            }
                        />
                        <WeeklyHeatmap
                            weeklyPattern={
                                forecastResult.weekly_pattern
                            }
                        />
                        <ExplanationCard
                            explanation={
                                forecastResult.explanation
                            }
                        />
                        <DiagnosticCard
                            diagnostic={
                                forecastResult.diagnostic
                            }
                        />
                        <MethodEvaluationTable
                            methods={
                                forecastResult.methods
                            }
                            bestMethod={
                                forecastResult.best_method
                            }
                        />

                        <PredictionTable
                            predictions={
                                forecastResult.predictions
                            }
                        />

                        <RecommendationCard
                            recommendation={
                                forecastResult.recommendation
                            }
                        />
                    </>
                )}
            </div>
        </main>
    );
}