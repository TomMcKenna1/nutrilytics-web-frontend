import apiClient from "../../../lib/apiClient";
import type { WeightLogCreate, WeightLogInDB } from "../types";

/**
 * Logs a new weight reading for the authenticated user.
 * @param payload - The weight and unit to log.
 * @returns The newly created weight log document.
 */
export const logWeight = (payload: WeightLogCreate): Promise<WeightLogInDB> => {
  return apiClient<WeightLogInDB>("/api/v1/weightLogs", {
    method: "POST",
    body: payload,
  });
};

/**
 * Fetches weight logs for a given date range.
 * @param startDate - The start date in 'YYYY-MM-DD' format.
 * @param endDate - The end date in 'YYYY-MM-DD' format.
 * @returns A list of weight logs.
 */
export const getWeightLogs = (
  startDate: string,
  endDate: string
): Promise<WeightLogInDB[]> => {
  const params = new URLSearchParams({ startDate, endDate });
  return apiClient<WeightLogInDB[]>(`/api/v1/weightLogs?${params.toString()}`);
};

/**
 * Deletes a specific weight log by its ID.
 * @param logId - The unique ID of the weight log to delete.
 */
export const deleteWeightLog = (logId: string): Promise<void> => {
  return apiClient<void>(`/api/v1/weightLogs/${logId}`, {
    method: "DELETE",
  });
};
