"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Region, Stock, Timeframe } from "@/lib/types";
import { mockStocks } from "@/lib/mock-data";

interface StockState {
  selectedRegion: Region;
  timeframe: Timeframe;
  showGainersOnly: boolean;
  searchQuery: string;
  stocks: Stock[];

  setRegion: (region: Region) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setShowGainersOnly: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStocks: (stocks: Stock[]) => void;
}

export const useStockStore = create<StockState>()(
  persist(
    (set) => ({
      selectedRegion: "nigeria",
      timeframe: "1d",
      showGainersOnly: false,
      searchQuery: "",
      stocks: mockStocks,

      setRegion: (region) => set({ selectedRegion: region }),
      setTimeframe: (timeframe) => set({ timeframe }),
      setShowGainersOnly: (value) => set({ showGainersOnly: value }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setStocks: (stocks) => set({ stocks }),
    }),
    {
      name: "apexpulse-storage",
    }
  )
);