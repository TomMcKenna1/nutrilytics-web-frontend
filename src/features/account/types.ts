export type UpdateNutritionTarget = Partial<NutritionTarget>;

export interface NutritionTarget {
  energy: number;
  fats: number;
  saturated_fats: number;
  carbohydrates: number;
  sugars: number;
  fibre: number;
  protein: number;
  salt: number;
}