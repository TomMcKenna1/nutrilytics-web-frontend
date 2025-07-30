import apiClient from "../../../lib/apiClient";
import type {
  NutritionTarget,
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
 * Sends an authenticated request to update the user's core profile information.
 * @param profileData - An object containing the profile fields to update.
 * @returns A promise that resolves with the updated user profile.
 */
export const updateAccountProfile = (
  profileData: Partial<UserProfileCreate>,
): Promise<UserInDB> => {
  return apiClient("/api/v1/account", {
    method: "PUT",
    body: { ...profileData },
  });
};

/**
 * Creates the user profile document in the backend database.
 * This should be called immediately after a new user signs up with Firebase.
 * @param profileData - The initial profile data for the user.
 * @returns A promise that resolves with the newly created user profile.
 */
export const createUserProfile = (
  profileData: UserProfileCreate
): Promise<UserInDB> => {
  return apiClient("/api/v1/account/", {
    method: "POST",
    body: { ...profileData },
  });
};

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
