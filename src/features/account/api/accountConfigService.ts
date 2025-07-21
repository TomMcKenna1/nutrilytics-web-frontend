import apiClient from "../../../lib/apiClient";
import type {NutritionTarget, UpdateNutritionTarget} from "../types"

/**
 * Sends an authenticated request to update the user's daily nutrition targets.
 * @param targets - An object containing the nutrition targets.
 * @returns A promise that resolves when the targets are successfully updated.
 */
export const updateNutritionTargets = (
  targets: UpdateNutritionTarget
): Promise<NutritionTarget> => {
  return apiClient("/api/v1/user/targets", {
    method: "PUT",
    body: targets,
  });
};

/**
 * Sends an authenticated request to retrieve the user's daily nutrition targets.
 * @returns A promise that resolves with the user's nutrition targets.
 */
export const getNutritionTargets = (): Promise<NutritionTarget> => {
  return apiClient("/api/v1/user/targets", {
    method: "GET",
  });
};