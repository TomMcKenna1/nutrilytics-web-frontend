export type UpdateNutritionTarget = Partial<NutritionTarget>;

export interface NutritionTarget {
  energy: number;
  fats: number;
  saturatedFats: number;
  carbohydrates: number;
  sugars: number;
  fibre: number;
  protein: number;
  salt: number;
}
