export interface WeightLogCreate {
  weight: number;
  unit: "kg" | "lbs";
}

export interface WeightLogInDB {
  id: string;
  date: string;
  weightKg: number;
}
