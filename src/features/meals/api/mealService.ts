import apiClient from "../../../lib/apiClient";
import type { Draft, MealListResponse, MealResponse } from "../types";

/**
 * Creates a meal draft. User must be authenticated.
 * @param mealDescription The text input from the user.
 * @returns The draftId for the created meal draft.
 */
export const createMealDraft = (
  mealDescription: string
): Promise<{ draftId: string }> => {
  return apiClient("/api/v1/meal_drafts", {
    body: { description: mealDescription },
  });
};

/**
 * Checks the status of a given meal draft from the backend.
 * @param draftId The ID of the draft to check.
 * @returns The status and data of the draft.
 */
export const checkDraftStatus = (draftId: string): Promise<Draft> => {
  return apiClient(`/api/v1/meal_drafts/${draftId}`);
};

/**
 * Fetches a paginated list of the latest saved meals.
 * @param limit The number of meals to fetch.
 * @param next The cursor for the next page of results.
 * @returns A list of meals and the next page cursor.
 */
export const getLatestMeals = ({
  limit,
  next,
}: {
  limit: number;
  next?: string | null;
}): Promise<MealListResponse> => {
  const params = new URLSearchParams({
    sort: "latest",
    limit: String(limit),
  });

  if (next) {
    params.append("next", next);
  }

  return apiClient(`/api/v1/meals?${params.toString()}`);
};

/**
 * Saves a completed draft as a permanent meal.
 * @param draftId The ID of the draft to save.
 * @returns The newly created Meal object from the backend.
 */
export const saveDraftAsMeal = (draftId: string): Promise<MealResponse> => {
  return apiClient("/api/v1/meals", {
    method: "POST",
    body: { draftId: draftId },
  });
};

/**
 * Fetches a single, saved meal by its ID from the backend API.
 * This function is now used instead of talking directly to Firestore.
 * @param mealId The ID of the meal document to fetch.
 * @returns The full Meal object.
 */
export const getMeal = (mealId: string): Promise<MealResponse> => {
  return apiClient(`/api/v1/meals/${mealId}`);
};

/**
 * Discards a meal draft. User must be authenticated.
 * @param draftId The ID of the draft to discard.
 * @returns An empty promise on success.
 */
export const discardMealDraft = (draftId: string): Promise<void> => {
  return apiClient(`/api/v1/meal_drafts/${draftId}`, {
    method: "DELETE",
  });
};

/**
 * Get all current meal draft. User must be authenticated.
 * @param draftId The ID of the draft to discard.
 * @returns An empty promise on success.
 */
export const getMealDrafts = (): Promise<Draft[]> => {
  return apiClient(`/api/v1/meal_drafts/`);
};
