"use client";

import { useStockStore } from "@/store/useStockStore";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function MarketSummary() {
  const { selectedRegion, stocks } = useStockStore();

  const regionStocks = stocks.filter((s) => s.region === selectedRegion);

  if (regionStocks.length === 0) return null;

  const gainers = regionStocks.filter((s) => s.changePercent > 0);
  const losers = regionStocks.filter((s) => s.changePercent < 0);

  const avgChange =
    regionStocks.reduce((sum, s) => sum + s.changePercent, 0) /
    regionStocks.length;

  const topGainer = [...regionStocks].sort(
    (a, b) => b.changePercent - a.changePercent
  )[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
          <Activity className="w-3.5 h-3.5" />
          Stocks Tracked
        </div>
        <p className="text-2xl font-bold">{regionStocks.length}</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Gainers
        </div>
        <p className="text-2xl font-bold text-emerald-400">{gainers.length}</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          Losers
        </div>
        <p className="text-2xl font-bold text-red-400">{losers.length}</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
          Avg Change
        </div>
        <p
          className={`text-2xl font-bold ${
            avgChange >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {avgChange >= 0 ? "+" : ""}
          {avgChange.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}