import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccountProfile,
  updateAccountProfile,
  updateNutritionTargets,
  onboardAccount,
} from "../features/account/api/accountService";
import type {
  UserInDB,
  UserProfileUpdate,
  UpdateNutritionTarget,
  NutritionTarget,
  OnboardingPayload,
} from "../features/account/types";

const accountQueryKey = ["account"];

/**
 * A comprehensive hook to fetch, cache, and manage the user's entire account data,
 * including profile and nutrition targets.
 */
export const useAccount = () => {
  const queryClient = useQueryClient();

  const {
    data: account,
    isLoading,
    isError,
    error,
  } = useQuery<UserInDB, Error>({
    queryKey: accountQueryKey,
    queryFn: getAccountProfile,
    retry: 1,
  });

  // Mutation for the new onboarding process
  const {
    mutateAsync: onboard,
    isPending: isOnboarding,
    isSuccess: isOnboardingSuccess,
  } = useMutation<UserInDB, Error, OnboardingPayload>({
    mutationFn: onboardAccount,
    onSuccess: (data) => {
      queryClient.setQueryData(accountQueryKey, data);
    },
  });

  // Mutation for updating the core user profile
  const {
    mutateAsync: updateProfile,
    isPending: isUpdatingProfile,
    isSuccess: isProfileUpdateSuccess,
  } = useMutation<UserInDB, Error, UserProfileUpdate>({
    mutationFn: updateAccountProfile,
    onSuccess: (data) => {
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
      queryClient.invalidateQueries({ queryKey: accountQueryKey });
    },
  });

  return {
    account,
    isLoading,
    isError,
    error,
    onboard,
    isOnboarding,
    isOnboardingSuccess,
    updateProfile,
    isUpdatingProfile,
    isProfileUpdateSuccess,
    updateTargets,
    isUpdatingTargets,
    isTargetsUpdateSuccess,
  };
};
