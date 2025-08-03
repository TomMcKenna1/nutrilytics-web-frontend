import apiClient from "../../../lib/apiClient";
import type { TDEEDataPoint } from "../types";

/**
 * Fetches the user's TDEE history for a given date range.
 * @param startDate - The start date in 'YYYY-MM-DD' format.
 * @param endDate - The end date in 'YYYY-MM-DD' format.
 * @returns An array of TDEE data points.
 */
export const getTdeeHistory = (
  startDate: string,
  endDate: string
): Promise<TDEEDataPoint[]> => {
  const params = new URLSearchParams({ startDate, endDate });
  return apiClient<TDEEDataPoint[]>(`/api/v1/tdee?${params.toString()}`);
};
