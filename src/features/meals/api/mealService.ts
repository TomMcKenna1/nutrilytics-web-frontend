import apiClient from "../../../lib/apiClient";
import type { MealDB, MealListResponse, MealType } from "../types";

/**
 * Creates a new meal. The meal is created with a 'pending' status
 * and is updated by the backend once generation is complete.
 * @param mealDescription The text input from the user.
 * @returns The newly created placeholder MealDB object.
 */
export const createMeal = (mealDescription: string): Promise<MealDB> => {
  return apiClient("/api/v1/meals", {
    body: { description: mealDescription },
    method: "POST",
  });
};

/**
 * Fetches a single meal by its ID from the backend API.
 * This can be used to check the status of a pending meal or get a completed one.
 * @param mealId The ID of the meal document to fetch.
 * @returns The full MealDB object.
 */
export const getMeal = (mealId: string): Promise<MealDB> => {
  return apiClient(`/api/v1/meals/${mealId}`);
};

/**
 * Fetches a paginated list of the latest meals for the user.
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
    limit: String(limit),
  });

  if (next) {
    params.append("next", next);
  }

  return apiClient(`/api/v1/meals?${params.toString()}`);
};

/**
 * Deletes a meal. User must be authenticated.
 * @param mealId The ID of the meal to delete.
 * @returns An empty promise on success.
 */
export const deleteMeal = (mealId: string): Promise<void> => {
  return apiClient(`/api/v1/meals/${mealId}`, {
    method: "DELETE",
  });
};

/**
 * Removes a component from a meal. User must be authenticated.
 * @param mealId The ID of the meal.
 * @param componentId The ID of the component to remove.
 * @returns The updated meal object.
 */
export const removeComponentFromMeal = (
  mealId: string,
  componentId: string,
): Promise<MealDB> => {
  return apiClient(`/api/v1/meals/${mealId}/components/${componentId}`, {
    method: "DELETE",
  });
};

/**
 * Adds a component to a meal. User must be authenticated.
 * The meal status will be set to 'pending_edit' until the backend completes the operation.
 * @param mealId The ID of the meal.
 * @param data The component data to add, containing a description.
 * @returns The updated meal object with a 'pending_edit' status.
 */
export const addComponentToMeal = (
  mealId: string,
  data: { description: string },
): Promise<MealDB> => {
  return apiClient(`/api/v1/meals/${mealId}/components`, {
    method: "POST",
    body: data,
  });
};

/**
 * Updates the type of a meal. User must be authenticated.
 * @param mealId The ID of the meal to update.
 * @param type The new meal type for the meal.
 * @returns The updated meal object.
 */
export const updateMealType = (
  mealId: string,
  type: MealType,
): Promise<MealDB> => {
  return apiClient(`/api/v1/meals/${mealId}/type`, {
    method: "PATCH",
    body: { type },
  });
};
