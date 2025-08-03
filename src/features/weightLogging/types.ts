export interface WeightLogCreate {
  weight: number;
  unit: "kg" | "lbs";
}

export interface WeightLogInDB {
  id: string;
  date: string;
  weightKg: number;
}

export interface WeightForecast {
  date: string;
  predictedWeightKg: number;
  lowerBoundKg: number;
  upperBoundKg: number;
}
