import { useQuery } from "@tanstack/react-query";
import { getWeightLogs } from "../features/weightLogging/api/weightLoggingService";

/**
 * A custom hook to fetch weight logs for a given date range.
 * @param startDate - The start date in 'YYYY-MM-DD' format.
 * @param endDate - The end date in 'YYYY-MM-DD' format.
 * @returns The react-query result for the weight logs query.
 */
export const useGetWeightLogs = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["weightLogs", { startDate, endDate }],
    queryFn: () => getWeightLogs(startDate, endDate),
    // This query will only run if both dates are provided.
    enabled: !!startDate && !!endDate,
    // Consider data fresh for 5 minutes to avoid excessive refetching.
    staleTime: 1000 * 60 * 5,
  });
};
