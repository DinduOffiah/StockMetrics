"use client";

import { TrendingUp } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">StockMetrics</h1>
            <p className="text-xs text-slate-400">Best Performing Stocks</p>
          </div>
        </div>

        <div className="text-sm text-slate-400 hidden sm:block">
          Live Market Monitor
        </div>
      </div>
    </header>
  );
}