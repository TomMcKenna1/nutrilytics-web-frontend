import apiClient from '../../../lib/apiClient';
import type { MealDraftResponse, MealListResponse } from '../types';

/**
 * Creates a meal draft. User must be authenticated.
 * @param mealDescription The text input from the user.
 * @returns The draftId for the created meal draft.
 */
export const createMealDraft = (
  mealDescription: string
): Promise<{ draftId: string }> => {
  return apiClient('/api/v1/meal_drafts', {
    body: { description: mealDescription },
  });
};

/**
 * Checks the status of a given meal draft from the backend.
 * @param draftId The ID of the draft to check.
 * @returns The status and data of the draft.
 */
export const checkDraftStatus = (draftId: string): Promise<MealDraftResponse> => {
  return apiClient(`/api/v1/meal_drafts/${draftId}`);
};

/**
 * Fetches a paginated list of the latest saved meals.
 * @param limit The number of meals to fetch.
 * @param next The cursor for the next page of results.
 * @returns A list of meals and the next page cursor.
 */
export const getLatestMeals = (
  { limit, next }: { limit: number; next?: string | null }
): Promise<MealListResponse> => {
  const params = new URLSearchParams({
    sort: 'latest',
    limit: String(limit),
  });

  if (next) {
    params.append('next', next);
  }

  return apiClient(`/api/v1/meals?${params.toString()}`);
};