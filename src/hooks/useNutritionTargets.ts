// src/hooks/useNutritionTargets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNutritionTargets,
  updateNutritionTargets,
} from "../features/account/api/accountService";
import type {
  NutritionTarget,
  UpdateNutritionTarget,
} from "../features/account/types";

/**
 * Fetches and caches the user's daily nutrition targets.
 */
export const useNutritionTargets = () => {
  const queryClient = useQueryClient();

  const query = useQuery<NutritionTarget, Error>({
    queryKey: ["nutrition-targets"],
    queryFn: getNutritionTargets,
  });

  const mutation = useMutation<NutritionTarget, Error, UpdateNutritionTarget>({
    mutationFn: updateNutritionTargets,
    onSuccess: () => {
      // On success, invalidate the query to refetch the fresh data.
      queryClient.invalidateQueries({ queryKey: ["nutrition-targets"] });
    },
  });

  return {
    targets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateTargets: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
