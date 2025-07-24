import { useQuery } from "@tanstack/react-query";
import { getMealDrafts } from "../features/meals/api/mealService";

/**
 * Fetches and caches the list of all active meal drafts.
 */
export const useMealDrafts = () => {
  return useQuery({
    queryKey: ["meal-drafts"],
    queryFn: getMealDrafts,
  });
};
