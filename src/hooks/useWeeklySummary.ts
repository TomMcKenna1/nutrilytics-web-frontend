import { useQuery } from "@tanstack/react-query";
import { getWeeklySummary } from "../features/metrics/api/summaryService";
import { toLocalDateString } from "../utils/dateUtils";

/**
 * A custom hook to fetch the user's weekly nutritional summary for a given start date.
 * @param startDate The Monday of the week to fetch.
 */
export const useWeeklySummary = (startDate: Date) => {
  const formattedDate = toLocalDateString(startDate);

  return useQuery({
    queryKey: ["weeklySummary", formattedDate],
    queryFn: () => getWeeklySummary(formattedDate),
    placeholderData: (previousData) => previousData,
  });
};
