"use client";

import { useMemo } from "react";
import RegionTabs from "@/components/layout/RegionTabs";
import StockCard from "@/components/StockCard";
import MarketSummary from "@/components/MarketSummary";
import { useStockStore } from "@/store/useStockStore";
import { Search } from "lucide-react";

export default function HomePage() {
  const {
    selectedRegion,
    stocks,
    showGainersOnly,
    setShowGainersOnly,
    searchQuery,
    setSearchQuery,
  } = useStockStore();

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

    // Sort by highest % change first
    result = [...result].sort((a, b) => b.changePercent - a.changePercent);

    return result;
  }, [stocks, selectedRegion, searchQuery, showGainersOnly]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Top Performing Stocks</h2>
        <p className="text-slate-400 text-sm">
          Real-time ranking of the best movers across markets
        </p>
      </div>

      {/* Region Tabs */}
      <div className="mb-6">
        <RegionTabs />
      </div>

      {/* Market Summary */}
      <MarketSummary />

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
      {filteredAndSorted.length === 0 ? (
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
  );
}