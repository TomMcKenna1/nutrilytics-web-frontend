import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccountProfile,
  updateAccountProfile,
  updateNutritionTargets,
} from "../features/account/api/accountService";
import type {
  UserInDB,
  UserProfileCreate,
  UpdateNutritionTarget,
  NutritionTarget,
} from "../features/account/types";

// A single query key for the entire user account
const accountQueryKey = ["account"];

/**
 * A comprehensive hook to fetch, cache, and manage the user's entire account data,
 * including profile and nutrition targets.
 */
export const useAccount = () => {
  const queryClient = useQueryClient();

  // The main query to fetch the entire UserInDB object
  const {
    data: account,
    isLoading,
    isError,
    error,
  } = useQuery<UserInDB, Error>({
    queryKey: accountQueryKey,
    queryFn: getAccountProfile,
  });

  // Mutation for updating the core user profile
  const {
    mutateAsync: updateProfile,
    isPending: isUpdatingProfile,
    isSuccess: isProfileUpdateSuccess,
  } = useMutation<UserInDB, Error, Partial<UserProfileCreate>>({
    mutationFn: updateAccountProfile,
    onSuccess: (data) => {
      // On success, update the cache directly with the returned data
      queryClient.setQueryData(accountQueryKey, data);
    },
  });

  // Mutation for updating nutrition targets
  const {
    mutateAsync: updateTargets,
    isPending: isUpdatingTargets,
    isSuccess: isTargetsUpdateSuccess,
  } = useMutation<NutritionTarget, Error, UpdateNutritionTarget>({
    mutationFn: updateNutritionTargets,
    onSuccess: () => {
      // On success, invalidate the main account query to refetch everything
      queryClient.invalidateQueries({ queryKey: accountQueryKey });
    },
  });

  return {
    account,
    isLoading,
    isError,
    error,
    updateProfile,
    isUpdatingProfile,
    isProfileUpdateSuccess,
    updateTargets,
    isUpdatingTargets,
    isTargetsUpdateSuccess,
  };
};