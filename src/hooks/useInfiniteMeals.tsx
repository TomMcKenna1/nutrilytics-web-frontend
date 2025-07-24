import { useState, useCallback } from "react";
import { getLatestMeals } from "../features/meals/api/mealService";
import type { MealResponse } from "../features/meals/types";

const MEALS_PER_PAGE = 5;

export const useInfiniteMeals = () => {
  const [meals, setMeals] = useState<MealResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(
    undefined,
  );

  const fetchMeals = useCallback(async (cursor: string | null | undefined) => {
    cursor ? setIsFetchingMore(true) : setIsLoading(true);
    setError(null);

    try {
      const response = await getLatestMeals({
        limit: MEALS_PER_PAGE,
        next: cursor,
      });
      setMeals((prevMeals) =>
        cursor ? [...prevMeals, ...response.meals] : response.meals,
      );
      setNextCursor(response.next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      cursor ? setIsFetchingMore(false) : setIsLoading(false);
    }
  }, []);

  const fetchInitialPage = useCallback(() => {
    fetchMeals(undefined);
  }, [fetchMeals]);

  const fetchNextPage = useCallback(() => {
    if (!isFetchingMore && nextCursor) {
      fetchMeals(nextCursor);
    }
  }, [fetchMeals, nextCursor, isFetchingMore]);

  return {
    meals,
    error,
    isLoading,
    isFetchingMore,
    fetchInitialPage,
    fetchNextPage,
    hasMore: nextCursor !== null,
  };
};
