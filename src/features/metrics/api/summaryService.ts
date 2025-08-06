import apiClient from "../../../lib/apiClient";
import { toLocalDateString } from "../../../utils/dateUtils";
import {
  type DailySummary,
  type MonthlySummaryResponse,
  type WeeklySummaryResponse,
} from "../types";

/**
 * Provides a summary of nutrition for the day.
 * @param date Optional date to get the summary for. Defaults to today.
 * @returns The daily macro summary.
 */
export const getDailySummary = (date?: Date): Promise<DailySummary> => {
  let url = `/api/v1/metrics/summary`;

  if (date) {
    const formattedDate = toLocalDateString(date);
    url += `?date=${formattedDate}`;
  }

  return apiClient(url);
};

/**
 * Provides a 7-day summary of nutrition for the week starting on the given date.
 * @param startDate The start date of the week in 'YYYY-MM-DD' format.
 * @returns The weekly macro summary.
 */
export const getWeeklySummary = (
  startDate: string
): Promise<WeeklySummaryResponse> => {
  return apiClient(`/api/v1/metrics/weeklySummary?startDate=${startDate}`);
};

/**
 * Provides a day-by-day nutritional summary for a given month.
 * @param yearMonth The month to fetch data for, in 'YYYY-MM' format.
 * @returns The monthly summary response.
 */
export const getMonthlySummary = (
  yearMonth: string
): Promise<MonthlySummaryResponse> => {
  return apiClient(`/api/v1/metrics/monthlySummary/${yearMonth}`);
};
