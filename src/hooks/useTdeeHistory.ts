import { useQuery } from "@tanstack/react-query";
import { getTdeeHistory } from "../features/tdee/api/tdeeService";
import type { TDEEDataPoint } from "../features/tdee/types";

// Helper to format a Date object as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * A hook to fetch the TDEE history for the last 30 days.
 */
export const useTdeeHistory = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const endDate = formatDate(today);
  const startDate = formatDate(thirtyDaysAgo);

  const queryKey = ["tdeeHistory", { startDate, endDate }];

  return useQuery<TDEEDataPoint[], Error>({
    queryKey,
    queryFn: () => getTdeeHistory(startDate, endDate),
  });
};
