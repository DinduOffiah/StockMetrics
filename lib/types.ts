export type Region = "global" | "africa" | "nigeria";

export type Timeframe = "1d" | "1w" | "1m" | "3m" | "1y";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  region: Region;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  currency: string;
  sector?: string;
  sparkline?: number[];
}

export interface MarketSummary {
  region: Region;
  topGainer: Stock | null;
  topLoser: Stock | null;
  averageChange: number;
  totalVolume: number;
}