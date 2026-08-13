import { Stock } from "./types";

export interface Recommendation {
  stock: Stock;
  reason: string;
  score: number;
  type: "strong_buy" | "buy" | "watch";
}

 //Simple momentum-based recommendation engine
export function generateRecommendations(stocks: Stock[]): Recommendation[] {
  return stocks
    .map((stock) => {
      let score = 0;
      let reason = "";

      // Strong positive momentum
      if (stock.changePercent >= 4) {
        score = 90 + Math.min(stock.changePercent, 10);
        reason = "Strong daily momentum";
      } else if (stock.changePercent >= 2.5) {
        score = 75 + stock.changePercent;
        reason = "Solid upward movement";
      } else if (stock.changePercent >= 1) {
        score = 60 + stock.changePercent;
        reason = "Positive trend";
      } else {
        score = 40;
        reason = "Limited momentum";
      }

      // Boost for high volume (liquidity)
      if (stock.volume > 5_000_000) {
        score += 5;
        reason += " + high volume";
      }

      // Slight boost for major stocks
      if (["NVDA", "AAPL", "MSFT", "DANGCEM", "MTNN", "GTCO"].includes(stock.symbol)) {
        score += 3;
      }

      let type: Recommendation["type"] = "watch";
      if (score >= 85) type = "strong_buy";
      else if (score >= 70) type = "buy";

      return {
        stock,
        reason,
        score: Math.min(Math.round(score), 99),
        type,
      };
    })
    .filter((r) => r.stock.changePercent > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}