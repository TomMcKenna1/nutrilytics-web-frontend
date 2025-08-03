export interface TDEEValues {
  estimatedTdeeKcal: number;
  estimatedWeightKg: number;
  lowerBoundKcal: number;
  upperBoundKcal: number;
}

export interface TDEEDataPoint {
  // YYYY-MM-DD format
  date: string;
  data: TDEEValues | null;
}
