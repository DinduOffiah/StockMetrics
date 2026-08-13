"use client";

import RegionTabs from "@/components/layout/RegionTabs";
import { useStockStore } from "@/store/useStockStore";

export default function HomePage() {
  const { selectedRegion, stocks } = useStockStore();

  const filtered = stocks.filter((s) => s.region === selectedRegion);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Top Performing Stocks</h2>
        <p className="text-slate-400 text-sm">
          Track the best movers across different markets
        </p>
      </div>

      <RegionTabs />

      <div className="mt-8">
        <p className="text-sm text-slate-400 mb-4">
          Showing {filtered.length} stocks in{" "}
          <span className="text-white capitalize">{selectedRegion}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stock) => (
            <div
              key={stock.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-xs text-slate-400">{stock.name}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
              <p className="text-xl font-bold">
                {stock.currency === "USD" ? "$" : stock.currency === "NGN" ? "₦" : ""}
                {stock.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}