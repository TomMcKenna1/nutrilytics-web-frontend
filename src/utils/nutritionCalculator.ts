import type {
  ActivityLevel,
  Goal,
  NutritionTarget,
  Sex,
  UserProfileCreate,
} from "../features/account/types";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const goalMultipliers: Record<Goal, number> = {
  // 20% calorie deficit
  lose_fat: 0.8,
  maintain_weight: 1.0,
  // 15% calorie surplus
  gain_muscle: 1.15,
};

const PROTEIN_PER_KG_BODYWEIGHT = 1.8; // 1.8g of protein per kg
const FAT_PERCENTAGE_OF_CALORIES = 0.25; // 25% of total calories from fat

// Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation (Unchanged)
const calculateBMR = (
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number
): number => {
  if (sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
};

/**
 * Calculates initial daily nutrition targets based on a user's profile using
 * a more robust, bodyweight-centric method for macronutrients.
 * @param profile - The complete user profile data.
 * @returns An object containing the calculated daily nutrition targets.
 */
export const calculateInitialTargets = (
  profile: UserProfileCreate
): NutritionTarget => {
  const { sex, age, heightCm, weightKg, goal, activityLevel } = profile;

  const bmr = calculateBMR(sex, weightKg, heightCm, age);
  const tdee = bmr * activityMultipliers[activityLevel];
  const finalEnergy = tdee * goalMultipliers[goal];

  // Protein is based on body weight for muscle maintenance and growth.
  const proteinGrams = weightKg * PROTEIN_PER_KG_BODYWEIGHT;
  const proteinCalories = proteinGrams * 4;

  // Fat is based on a percentage of total calories for hormonal health.
  const fatCalories = finalEnergy * FAT_PERCENTAGE_OF_CALORIES;
  const fatGrams = fatCalories / 9;

  // Carbohydrates fill the remaining calorie budget.
  const carbohydrateCalories = finalEnergy - proteinCalories - fatCalories;
  const carbsGrams = carbohydrateCalories / 4;

  // Sugars: Limit to <10% of total energy
  const sugarsGrams = (finalEnergy * 0.1) / 4;
  // Saturated Fats: Limit to <10% of total energy
  const saturatedFatsGrams = (finalEnergy * 0.1) / 9;
  // Fibre: Recommended ~14g per 1000 kcal
  const fibreGrams = (finalEnergy / 1000) * 14;

  return {
    energy: Math.round(finalEnergy),
    protein: Math.round(proteinGrams),
    carbohydrates: Math.round(carbsGrams),
    fats: Math.round(fatGrams),
    sugars: Math.round(sugarsGrams),
    fibre: Math.round(fibreGrams),
    saturatedFats: Math.round(saturatedFatsGrams),
    salt: 6, // General recommendation from health bodies like the NHS
  };
};
