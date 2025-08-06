import { useQuery } from "@tanstack/react-query";
import { getMonthlySummary } from "../features/metrics/api/summaryService";
import { formatDate } from "../utils/dateUtils";

/**
 * A custom hook to fetch the user's monthly nutritional summary.
 * @param date A date within the month to fetch.
 */
export const useMonthlySummary = (date: Date) => {
  const yearMonth = formatDate(date, "yyyy-MM");

  return useQuery({
    queryKey: ["monthlySummary", yearMonth],
    queryFn: () => getMonthlySummary(yearMonth),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};
