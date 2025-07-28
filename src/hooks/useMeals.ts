import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMeal,
  getMeal,
  addComponentToMeal,
  removeComponentFromMeal,
  updateMealType,
} from "../features/meals/api/mealService";
import type { MealDB, MealType } from "../features/meals/types";

const MEAL_LIST_QUERY_KEY = ["mealsList"];

/**
 * Parses the flexible 'createdAt' field into a standard Date object.
 */
const parseCreatedAt = (createdAt: MealDB["createdAt"]): Date | null => {
  if (!createdAt) return null;
  if (typeof createdAt === "string") {
    return new Date(createdAt);
  }
  if (typeof createdAt === "number") {
    return new Date(createdAt * 1000);
  }
  if (createdAt?._seconds) {
    return new Date(createdAt._seconds * 1000);
  }
  return null;
};

/**
 * Checks if a given Date object represents today's date.
 */
const isDateToday = (date: Date | null): boolean => {
  if (!date) return false;
  const today = new Date();
  return date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
};

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
      queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
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
