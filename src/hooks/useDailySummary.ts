import { useQuery } from "@tanstack/react-query";
import { getDailySummary } from "../features/metrics/api/summaryService";

/**
 * A custom hook to fetch the user's daily nutritional summary.
 * Handles caching, refetching, and state management via TanStack Query.
 */
export const useDailySummary = () => {
  return useQuery({
    queryKey: ["dailySummary"],
    queryFn: getDailySummary,
  });
};
