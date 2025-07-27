import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getLatestMeals, deleteMeal } from "../features/meals/api/mealService";
import type { MealListResponse } from "../features/meals/types";

const MEALS_PER_PAGE = 10;
const MEAL_LIST_QUERY_KEY = ["mealsList"];

/**
 * Hook for fetching and managing the infinite list of meals.
 */
export const useMealList = () => {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: MEAL_LIST_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getLatestMeals({ limit: MEALS_PER_PAGE, next: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: MealListResponse) =>
      lastPage.next ?? undefined,
  });

  const deleteMealMutation = useMutation({
    mutationFn: (mealId: string) => deleteMeal(mealId),
    onSuccess: (_data, mealId) => {
      // Invalidate the list query to refetch and show the updated list
      queryClient.invalidateQueries({ queryKey: MEAL_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
      queryClient.removeQueries({ queryKey: ["meal", mealId] });
    },
  });

  const meals = data?.pages.flatMap((page) => page.meals) ?? [];

  return {
    meals,
    error: error ? (error as Error).message : null,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    fetchNextPage,
    hasMore: !!hasNextPage,
    deleteMeal: deleteMealMutation.mutate,
    isDeleting: deleteMealMutation.isPending,
  };
};
