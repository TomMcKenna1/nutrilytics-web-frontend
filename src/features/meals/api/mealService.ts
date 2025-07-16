import apiClient from '../../../lib/apiClient';
import type { MealDraftResponse } from '../types';

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