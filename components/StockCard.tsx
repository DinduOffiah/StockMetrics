"use client";

import { Stock } from "@/lib/types";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface Props {
  stock: Stock;
  rank?: number;
}

export default function StockCard({ stock, rank }: Props) {
  const isPositive = stock.changePercent >= 0;

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD")
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (currency === "NGN")
      return `₦${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (currency === "ZAR")
      return `R${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (currency === "KES")
      return `KSh ${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    return price.toLocaleString();
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(1)}B`;
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
    return vol.toString();
  };

  const sparkData =
    stock.sparkline?.map((value, index) => ({ value, index })) || [];

  return (
    <div className="group bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rank && (
            <span className="text-xs font-bold text-slate-500 w-5">#{rank}</span>
          )}
          <div>
            <p className="font-semibold text-lg tracking-tight">{stock.symbol}</p>
            <p className="text-xs text-slate-400 line-clamp-1 max-w-[160px]">
              {stock.name}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {isPositive ? "+" : ""}
          {stock.changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-2xl font-bold tracking-tight">
          {formatPrice(stock.price, stock.currency)}
        </p>
        <p
          className={`text-sm mt-0.5 ${
            isPositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {stock.change.toFixed(2)} today
        </p>
      </div>

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <div className="h-12 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#34d399" : "#f87171"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
        <span>{stock.exchange}</span>
        <span>Vol: {formatVolume(stock.volume)}</span>
      </div>

      {stock.sector && (
        <div className="mt-3">
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
            {stock.sector}
          </span>
        </div>
      )}
    </div>
  );
}