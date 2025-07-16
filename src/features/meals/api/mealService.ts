import { auth } from "../../../lib/firebase";

/**
 * Creates a meal draft. User must be authenticated.
 * @param mealDescription The text input from the user.
 * @returns The draftId for the created meal draft.
 */
export const createMealDraft = async (
  mealDescription: string
): Promise<{ draftId: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No authenticated user found.");
  }

  const idToken = await currentUser.getIdToken();

  const apiBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/meal_drafts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ description: mealDescription }),
  });

  if (!response.ok) {
    // You can add more specific error handling here based on response status
    throw new Error("Failed to create meal draft.");
  }

  return response.json();
};
