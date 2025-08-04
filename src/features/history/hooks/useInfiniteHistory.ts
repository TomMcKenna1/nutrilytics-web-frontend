import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { getMonthlySummary } from "../../metrics/api/summaryService";
import { formatDate, subMonths } from "../../../utils/dateUtils";

/**
 * A custom hook to fetch a user's nutritional summary in monthly pages for an infinite scroll component.
 *
 * @param initialDate The initial date to start fetching data from.
 */
export const useInfiniteHistory = (initialDate: Date) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["infiniteHistory"],
    queryFn: async ({ pageParam }) => {
      const targetMonth = pageParam
        ? subMonths(initialDate, pageParam)
        : initialDate;
      const yearMonth = formatDate(targetMonth, "yyyy-MM");

      if (targetMonth > new Date()) {
        return { data: {}, nextPage: undefined };
      }

      const monthlyData = await queryClient.fetchQuery({
        queryKey: ["monthlySummary", yearMonth],
        queryFn: () => getMonthlySummary(yearMonth),
      });

      return {
        data: monthlyData,
        nextPage: (pageParam ?? 0) + 1,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    // 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};
