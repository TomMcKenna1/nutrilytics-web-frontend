export type Sex = "male" | "female";
export type Goal = "maintain_weight" | "lose_fat" | "gain_muscle";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export const SexOptions = {
  MALE: "male",
  FEMALE: "female",
} as const;

export const GoalOptions = {
  MAINTAIN_WEIGHT: "maintain_weight",
  LOSE_FAT: "lose_fat",
  GAIN_MUSCLE: "gain_muscle",
} as const;

export const ActivityLevelOptions = {
  SEDENTARY: "sedentary",
  LIGHTLY_ACTIVE: "lightly_active",
  MODERATELY_ACTIVE: "moderately_active",
  VERY_ACTIVE: "very_active",
  EXTRA_ACTIVE: "extra_active",
} as const;

export interface UserProfileCreate {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
}
export interface UserInDB {
  uid: string;
  email: string | null;
  name: string | null;
  createdAt: string;
  profile: Partial<UserProfileCreate>;
  nutritionTargets?: Partial<NutritionTarget>;
}

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
