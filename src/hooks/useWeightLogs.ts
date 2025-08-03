import { useQuery } from "@tanstack/react-query";
import { getWeightLogs } from "../features/weightLogging/api/weightLoggingService";

/**
 * A custom hook to fetch weight logs for a given date range.
 * @param startDate - The start date in 'YYYY-MM-DD' format.
 * @param endDate - The end date in 'YYYY-MM-DD' format.
 * @returns The react-query result for the weight logs query.
 */
export const useWeightLogs = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["weightLogs", { startDate, endDate }],
    queryFn: () => getWeightLogs(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
