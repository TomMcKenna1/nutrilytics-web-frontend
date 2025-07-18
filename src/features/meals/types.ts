export type MealDraftStatus = 'pending' | 'complete' | 'error';

export interface NutrientProfile {
  energy: number;
  fats: number;
  saturatedFats: number;
  carbohydrates: number;
  sugars: number;
  fibre: number;
  protein: number;
  salt: number;
  containsDairy: boolean;
  containsHighDairy: boolean;
  containsGluten: boolean;
  containsHighGluten: boolean;
  containsHistamines: boolean;
  containsHighHistamines: boolean;
  containsSulphites: boolean;
  containsHighSulphites: boolean;
  containsSalicylates: boolean;
  containsHighSalicylates: boolean;
  containsCapsaicin: boolean;
  containsHighCapsaicin: boolean;
  isProcessed: boolean;
  isUltraProcessed: boolean;
}

export interface MealComponent {
  name: string;
  brand: string | null;
  quantity: string;
  totalWeight: number;
  nutrientProfile: NutrientProfile;
}

export interface Meal {
  name: string;
  description: string;
  components: MealComponent[];
}

export interface MealResponse extends Meal {
  id: string;
  uid: string;
  createdAt: string;
}

export interface MealDraftResponse {
  status: MealDraftStatus;
  uid: string;
  meal: Meal | null;
}

export interface Draft {
  id: string;
  originalInput: string;
  status: MealDraftStatus;
  mealData: Meal | null;
  createdAt: number;
  error?: string;
}

export interface MealListResponse {
  meals: MealResponse[];
  next: string | null;
}