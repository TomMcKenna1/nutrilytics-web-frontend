import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMeal,
  getMeal,
  addComponentToMeal,
  removeComponentFromMeal,
} from "../features/meals/api/mealService";

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
      queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
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
  };
};
