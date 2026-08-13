"use client";

import { useStockStore } from "@/store/useStockStore";
import { Region } from "@/lib/types";

const regions: { value: Region; label: string; flag: string }[] = [
  { value: "global", label: "Global", flag: "🌍" },
  { value: "africa", label: "Africa", flag: "🌍" },
  { value: "nigeria", label: "Nigeria", flag: "🇳🇬" },
];

export default function RegionTabs() {
  const { selectedRegion, setRegion } = useStockStore();

  return (
    <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
      {regions.map((region) => (
        <button
          key={region.value}
          onClick={() => setRegion(region.value)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
            ${
              selectedRegion === region.value
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }
          `}
        >
          <span>{region.flag}</span>
          {region.label}
        </button>
      ))}
    </div>
  );
}