import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getLatestMeals, deleteMeal } from "../features/meals/api/mealService";
import type { MealListResponse, MealDB } from "../features/meals/types";
import {
  getMonday,
  isDateInCurrentWeek,
  isDateToday,
  parseCreatedAt,
  toLocalDateString,
} from "../utils/dateUtils";

const MEALS_PER_PAGE = 5;
const MEAL_LIST_QUERY_KEY = ["mealsList"];

type DeleteMutationContext = {
  previousMealListData?: InfiniteData<MealListResponse>;
  deletedMeal?: MealDB;
};

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
    onMutate: async (mealId: string): Promise<DeleteMutationContext> => {
      await queryClient.cancelQueries({ queryKey: MEAL_LIST_QUERY_KEY });

      const previousMealListData =
        queryClient.getQueryData<InfiniteData<MealListResponse>>(
          MEAL_LIST_QUERY_KEY
        );

      const deletedMeal = previousMealListData?.pages
        .flatMap((page) => page.meals)
        .find((meal) => meal.id === mealId);

      queryClient.setQueryData<InfiniteData<MealListResponse>>(
        MEAL_LIST_QUERY_KEY,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              meals: page.meals.filter((meal) => meal.id !== mealId),
            })),
          };
        }
      );
      return { previousMealListData, deletedMeal };
    },
    onError: (_err, _mealId, context) => {
      if (context?.previousMealListData) {
        queryClient.setQueryData(
          MEAL_LIST_QUERY_KEY,
          context.previousMealListData
        );
      }
    },
    onSuccess: (_data, mealId, context) => {
      queryClient.invalidateQueries({ queryKey: MEAL_LIST_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ["meal", mealId] });

      if (!context?.deletedMeal) return;

      const createdAtDate = parseCreatedAt(context.deletedMeal.createdAt);

      if (isDateToday(createdAtDate)) {
        queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
      }

      if (isDateInCurrentWeek(createdAtDate)) {
        const currentWeekMonday = toLocalDateString(getMonday(new Date()));
        queryClient.invalidateQueries({
          queryKey: ["weeklySummary", currentWeekMonday],
        });
      }
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
