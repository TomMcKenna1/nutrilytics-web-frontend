import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDailySummary } from "../features/metrics/api/summaryService";
import { toLocalDateString } from "../utils/dateUtils";

/**
 * A custom hook to fetch the user's daily nutritional summary for a specific date.
 * Handles caching, refetching, and state management via TanStack Query.
 * @param date The date for which to fetch the summary. Defaults to today.
 */
export const useDailySummary = (date: Date = new Date()) => {
  const queryKey = ["dailySummary", toLocalDateString(date)];

  return useQuery({
    queryKey: queryKey,
    queryFn: () => getDailySummary(date),
    placeholderData: keepPreviousData,
  });
};
