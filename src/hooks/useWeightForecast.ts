import { useQuery } from "@tanstack/react-query";
import { getWeightForecast } from "../features/weightLogging/api/weightLoggingService";

/**
 * Custom hook to fetch the 14-day weight forecast.
 *
 * This hook manages fetching, caching, and state transitions for the forecast data.
 * The data is considered fresh for 1 hour.
 */
export const useWeightForecast = () => {
  return useQuery({
    queryKey: ["weightForecast"],
    queryFn: getWeightForecast,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};
