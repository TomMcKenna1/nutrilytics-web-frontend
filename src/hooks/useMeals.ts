import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMeal,
  getMeal,
  addComponentToMeal,
  removeComponentFromMeal,
  updateMealType,
} from "../features/meals/api/mealService";
import type { MealType } from "../features/meals/types";
import {
  getMonday,
  isDateInCurrentWeek,
  isDateToday,
  parseCreatedAt,
  toLocalDateString,
} from "../utils/dateUtils";

const MEAL_LIST_QUERY_KEY = ["mealsList"];

/**
 * Hook for fetching and managing a single meal by its ID.
 */
export const useMeal = (mealId: string | undefined) => {
  const queryClient = useQueryClient();
  const mealQueryKey = ["meal", mealId];

  const {
    data: meal,
    isLoading,
    error,
  } = useQuery({
    queryKey: mealQueryKey,
    queryFn: () => getMeal(mealId!),
    enabled: !!mealId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEAL_LIST_QUERY_KEY });
      queryClient.removeQueries({ queryKey: mealQueryKey });
      if (!meal) {
        return;
      }
      const createdAtDate = parseCreatedAt(meal?.createdAt);

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

  const addComponentMutation = useMutation({
    mutationFn: (description: string) => {
      if (!mealId) throw new Error("Meal ID is required.");
      return addComponentToMeal(mealId, { description });
    },
    onSuccess: (updatedMeal) => {
      queryClient.setQueryData(mealQueryKey, updatedMeal);
      queryClient.invalidateQueries({ queryKey: MEAL_LIST_QUERY_KEY });
    },
  });

  const removeComponentMutation = useMutation({
    mutationFn: (componentId: string) => {
      if (!mealId) throw new Error("Meal ID is required.");
      return removeComponentFromMeal(mealId, componentId);
    },
    onSuccess: (updatedMeal) => {
      queryClient.setQueryData(mealQueryKey, updatedMeal);
      queryClient.invalidateQueries({ queryKey: MEAL_LIST_QUERY_KEY });

      const createdAtDate = parseCreatedAt(updatedMeal.createdAt);

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

  const updateMealTypeMutation = useMutation({
    mutationFn: (newType: MealType) => {
      if (!mealId) throw new Error("Meal ID is required.");
      return updateMealType(mealId, newType);
    },
    onSuccess: (updatedMeal) => {
      queryClient.setQueryData(mealQueryKey, updatedMeal);
      queryClient.invalidateQueries({ queryKey: MEAL_LIST_QUERY_KEY });

      const createdAtDate = parseCreatedAt(updatedMeal.createdAt);

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

  return {
    meal,
    isLoading,
    error: error ? (error as Error).message : null,
    deleteMeal: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    addComponent: addComponentMutation.mutateAsync,
    isAddingComponent: addComponentMutation.isPending,
    removeComponent: removeComponentMutation.mutateAsync,
    isRemovingComponent: removeComponentMutation.isPending,
    updateMealType: updateMealTypeMutation.mutateAsync,
    isUpdatingMealType: updateMealTypeMutation.isPending,
  };
};
