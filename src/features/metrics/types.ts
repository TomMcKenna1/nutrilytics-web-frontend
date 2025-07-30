export interface NutrientSummary {
  energy: number;
  fats: number;
  saturatedFats: number;
  carbohydrates: number;
  sugars: number;
  fibre: number;
  protein: number;
  salt: number;
}

export interface DailySummary extends NutrientSummary {
  mealCount: number;
  snackCount: number;
  beverageCount: number;
}

export interface WeeklyBreakdown {
  meals: NutrientSummary | null;
  snacks: NutrientSummary | null;
  beverages: NutrientSummary | null;
}

export type WeeklySummaryResponse = Record<string, WeeklyBreakdown | null>;