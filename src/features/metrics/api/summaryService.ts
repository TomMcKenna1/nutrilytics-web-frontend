import apiClient from "../../../lib/apiClient";
import { type DailySummary, type WeeklySummaryResponse } from "../types";

/**
 * Provides a summary of nutrition for the day
 * @returns The daily macro summary.
 */
export const getDailySummary = (): Promise<DailySummary> => {
  return apiClient(`/api/v1/metrics/summary`);
};

/**
 * Provides a 7-day summary of nutrition for the week starting on the given date.
 * @param startDate The start date of the week in 'YYYY-MM-DD' format.
 * @returns The weekly macro summary.
 */
export const getWeeklySummary = (
  startDate: string,
): Promise<WeeklySummaryResponse> => {
  // The endpoint path is constructed as requested.
  return apiClient(`/api/v1/metrics/weeklySummary?startDate=${startDate}`);
};
