export type MealGenerationStatus =
  | "pending"
  | "complete"
  | "error"
  | "pending_edit";

export type MealType = "meal" | "snack" | "beverage";

export type DataSource =
  | "retrieved_api"
  | "estimated_with_context"
  | "estimated_model";

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
  dataSource: DataSource;
}

export interface MealComponent {
  id: string;
  name: string;
  brand: string | null;
  quantity: number;
  metric: string | null;
  totalWeight: number;
  nutrientProfile: NutrientProfile;
  sourceUrl?: string | null;
}

export interface GeneratedMeal {
  name: string;
  description: string;
  type: MealType;
  nutrientProfile: NutrientProfile;
  components: MealComponent[];
}

export interface MealDB {
  id: string;
  uid: string;
  originalInput: string;
  status: MealGenerationStatus;
  // Supports Firestore timestamp object
  createdAt: number | { _seconds: number; _nanoseconds: number };
  error?: string;
  data?: GeneratedMeal | null;
}

export interface MealListResponse {
  meals: MealDB[];
  next: string | null;
}
