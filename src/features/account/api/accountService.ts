import apiClient from "../../../lib/apiClient";
import type {
  NutritionTarget,
  OnboardingPayload,
  UpdateNutritionTarget,
  UserProfileCreate,
  UserInDB,
} from "../types";

/**
 * Retrieves the full user account data from the backend.
 * @returns A promise that resolves with the user's full account profile.
 */
export const getAccountProfile = (): Promise<UserInDB> => {
  return apiClient("/api/v1/account/", {
    method: "GET",
  });
};

/**
 * Creates the initial user record in the backend after Firebase sign-up.
 * This endpoint takes no body and sets onboardingComplete to false.
 * @returns A promise that resolves with the newly created user record.
 */
export const createUserRecord = (): Promise<UserInDB> => {
  return apiClient("/api/v1/account/", {
    method: "POST",
  });
};

/**
 * Submits the full onboarding payload to the backend.
 * This sets the user's profile and initial targets, and marks onboarding as complete.
 * @param payload - The user's profile and calculated nutrition targets.
 * @returns A promise that resolves with the updated user data.
 */
export const onboardAccount = (
  payload: OnboardingPayload
): Promise<UserInDB> => {
  return apiClient("/api/v1/account/onboard", {
    method: "POST",
    body: { ...payload },
  });
};

/**
 * Sends an authenticated request to update the user's core profile information.
 * @param profileData - An object containing the profile fields to update.
 * @returns A promise that resolves with the updated user profile.
 */
export const updateAccountProfile = (
  profileData: Partial<UserProfileCreate>
): Promise<UserInDB> => {
  return apiClient("/api/v1/account/", {
    method: "PUT",
    body: { ...profileData },
  });
};

// ... the other functions (updateNutritionTargets, getNutritionTargets) remain unchanged
/**
 * Sends an authenticated request to update the user's daily nutrition targets.
 * @param targets - An object containing the nutrition targets.
 * @returns A promise that resolves when the targets are successfully updated.
 */
export const updateNutritionTargets = (
  targets: UpdateNutritionTarget
): Promise<NutritionTarget> => {
  return apiClient("/api/v1/account/targets", {
    method: "PUT",
    body: { ...targets },
  });
};

/**
 * Sends an authenticated request to retrieve the user's daily nutrition targets.
 * @returns A promise that resolves with the user's nutrition targets.
 */
export const getNutritionTargets = (): Promise<NutritionTarget> => {
  return apiClient("/api/v1/account/targets", {
    method: "GET",
  });
};
