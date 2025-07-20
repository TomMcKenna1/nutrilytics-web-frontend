import apiClient from "../../../lib/apiClient";
import { type DailySummary } from "../types";

/**
 * Provides a summary of nutrition for the day
 * @returns The daily macro summary.
 */
export const getDailySummary = (): Promise<DailySummary> => {
  return apiClient(`/api/v1/metrics/summary`);
};