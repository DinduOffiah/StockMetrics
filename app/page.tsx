"use client";

import { useEffect, useMemo, useState } from "react";
import RegionTabs from "@/components/layout/RegionTabs";
import StockCard from "@/components/StockCard";
import MarketSummary from "@/components/MarketSummary";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/layout/Footer";
import { useStockStore } from "@/store/useStockStore";
import { fetchStocksByRegion } from "@/lib/api";
import { Search, RefreshCw } from "lucide-react";

export default function HomePage() {
  const {
    selectedRegion,
    stocks,
    setStocks,
    showGainersOnly,
    setShowGainersOnly,
    searchQuery,
    setSearchQuery,
  } = useStockStore();

  const [isLoading, setIsLoading] = useState(false);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const data = await fetchStocksByRegion(selectedRegion);

      // Check if we received live data (simple heuristic)
      const isLive =
        data.length > 0 &&
        data.some((s) => s.id.startsWith("ngx-") || s.id.startsWith("global-"));

      setStocks(data);
      setUsingLiveData(isLive);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load stocks:", error);
      setUsingLiveData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data whenever the region changes
  useEffect(() => {
    loadData();
  }, [selectedRegion]);

  const filteredAndSorted = useMemo(() => {
    let result = stocks.filter((s) => s.region === selectedRegion);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      );
    }

    // Gainers only
    if (showGainersOnly) {
      result = result.filter((s) => s.changePercent > 0);
    }

    // Sort by highest % change
    result = [...result].sort((a, b) => b.changePercent - a.changePercent);

    return result;
  }, [stocks, selectedRegion, searchQuery, showGainersOnly]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Top Performing Stocks</h2>
          <p className="text-slate-400 text-sm">
            Track the best movers across Global, Africa & Nigeria
          </p>
        </div>

        {/* Region Tabs */}
        <div className="mb-6">
          <RegionTabs />
        </div>

        {/* Live / Demo Indicator + Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-sm text-slate-400">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Loading market data...
              </span>
            ) : usingLiveData ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live data
                {lastUpdated && (
                  <span className="text-xs text-slate-500">
                    • Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Demo data
              </span>
            )}
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Market Summary */}
        <MarketSummary />

        {/* Smart Recommendations */}
        <Recommendations />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Gainers Toggle */}
          <button
            onClick={() => setShowGainersOnly(!showGainersOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              showGainersOnly
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {showGainersOnly ? "Showing Gainers Only" : "Show Gainers Only"}
          </button>
        </div>

        {/* Results count */}
        <div className="mb-5">
          <h3 className="font-semibold">
            {filteredAndSorted.length} Stock
            {filteredAndSorted.length !== 1 ? "s" : ""}
            {showGainersOnly && " (Gainers)"}
          </h3>
        </div>

        {/* Stock Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">
            Loading stocks...
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg mb-2">No stocks found</p>
            <p className="text-sm">Try changing the region or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredAndSorted.map((stock, index) => (
              <StockCard key={stock.id} stock={stock} rank={index + 1} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}