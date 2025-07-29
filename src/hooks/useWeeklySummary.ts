import { useQuery } from "@tanstack/react-query";
import { getWeeklySummary } from "../features/metrics/api/summaryService";

/**
 * A custom hook to fetch the user's weekly nutritional summary for a given start date.
 * @param startDate The Monday of the week to fetch.
 */
export const useWeeklySummary = (startDate: Date) => {
  const offset = startDate.getTimezoneOffset();
  const normalisedDate = new Date(startDate.getTime() - offset * 60 * 1000);
  const formattedDate = normalisedDate.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["weeklySummary", formattedDate],
    queryFn: () => getWeeklySummary(formattedDate),
    placeholderData: (previousData) => previousData,
  });
};
