"use client";

import { useEffect, useState } from "react";

import DatasetSelector from "@/components/forecast/DatasetSelector";
import HistoricalDatasetTable from "@/components/forecast/HistoricalDatasetTable";
import MethodEvaluationTable from "@/components/forecast/MethodEvaluationTable";
import PredictionTable from "@/components/forecast/PredictionTable";
import RecommendationCard from "@/components/forecast/RecommendationCard";

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

        setHistoryData(result.data || []);
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

        setForecastResult(result.data);
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
        <div className="p-10">

            <div className="mb-10">
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
    );
}