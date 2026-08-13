"use client";

import { useMemo } from "react";
import { useStockStore } from "@/store/useStockStore";
import { generateRecommendations } from "@/lib/recommendations";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function Recommendations() {
  const { selectedRegion, stocks } = useStockStore();

  const recommendations = useMemo(() => {
    const regionStocks = stocks.filter((s) => s.region === selectedRegion);
    return generateRecommendations(regionStocks);
  }, [stocks, selectedRegion]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold">Smart Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.stock.id}
            className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8" />

            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-lg">{rec.stock.symbol}</p>
                <p className="text-xs text-slate-400">{rec.stock.name}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  rec.type === "strong_buy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : rec.type === "buy"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {rec.type === "strong_buy"
                  ? "Strong Buy"
                  : rec.type === "buy"
                  ? "Buy"
                  : "Watch"}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-4">{rec.reason}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                +{rec.stock.changePercent.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500">
                Score: {rec.score}/100
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}