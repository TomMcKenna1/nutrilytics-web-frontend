import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeal } from "../features/meals/api/mealService";
import {
  getMonday,
  isDateInCurrentWeek,
  isDateToday,
  toLocalDateString,
} from "../utils/dateUtils";

/**
 * Hook for creating a new meal.
 */
export const useCreateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { description: string; date: Date }) => createMeal(data),
    onSuccess: (_newMeal, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mealsList"] });

      // Invalidate summaries if the meal was for today or this week
      const createdAtDate = variables.date;
      if (isDateToday(createdAtDate)) {
        queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
      }
      if (isDateInCurrentWeek(createdAtDate)) {
        const currentWeekMonday = toLocalDateString(getMonday(new Date()));
        queryClient.invalidateQueries({
          queryKey: ["weeklySummary", currentWeekMonday],
        });
      }

      // Invalidate account query to update things like log streaks
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
};
