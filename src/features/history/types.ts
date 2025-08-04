import type { NutrientProfile } from "../meals/types";

export type NutrientSummary = Pick<
  NutrientProfile,
  "energy" | "protein" | "carbohydrates" | "fats"
>;

export interface DailyHistoryLog {
  nutrition: NutrientSummary;
  mealCount: number;
  logs: string[];
}

export type MonthlyData = Record<string, DailyHistoryLog>;
