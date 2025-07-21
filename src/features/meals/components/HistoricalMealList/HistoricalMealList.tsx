import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useInfiniteMeals } from "../../../../hooks/useInfiniteMeals";
import MealItemPlaceholder from "../MealItemPlaceholder/MealItemPlaceholder";
import styles from "./HistoricalMealList.module.css";

const ROW_HEIGHT_REM = 3.5;
const PLACEHOLDER_COUNT = 3;

interface HistoricalMealListProps {
  maxVisibleRows?: number;
}

const NoMealsPlaceholder = () => (
  <div className={styles.noMealsPlaceholder}>
    <p>No meal logs available</p>
    <p>Log a meal to get started!</p>
  </div>
);

export const HistoricalMealList = ({
  maxVisibleRows = 5,
}: HistoricalMealListProps) => {
  const {
    meals,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    fetchInitialPage,
    fetchNextPage,
  } = useInfiniteMeals();

  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({
    root: scrollContainerRef.current,
    rootMargin: "0px 0px 100px 0px",
  });

  // Fetch more meals when the trigger comes into view
  useEffect(() => {
    if (inView && hasMore && !isFetchingMore) {
      fetchNextPage();
    }
  }, [inView, hasMore, isFetchingMore, fetchNextPage]);

  const updateScrollHint = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isScrollable = container.scrollHeight > container.clientHeight;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 1;

      // Show hint if scrollable, unless at the bottom AND no more data exists
      const atAbsoluteEnd = isAtBottom && !hasMore;
      setShowScrollHint(isScrollable && !atAbsoluteEnd);
    }
  }, [hasMore]);

  useEffect(() => {
    const timer = setTimeout(updateScrollHint, 100);
    return () => clearTimeout(timer);
  }, [meals, isLoading, updateScrollHint]);

  useEffect(() => {
    fetchInitialPage();
  }, [fetchInitialPage]);

  const containerStyle = {
    height: `${maxVisibleRows * ROW_HEIGHT_REM}rem`,
  };

  if (isLoading) {
    return (
      <div className={styles.container} style={containerStyle}>
        <div className={styles.list}>
          {Array.from({ length: maxVisibleRows }).map((_, index) => (
            <MealItemPlaceholder key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className={styles.error}>{error}</p>;

  if (meals.length === 0) {
    return (
      <div className={styles.container} style={containerStyle}>
        <NoMealsPlaceholder />
      </div>
    );
  }

  return (
    <div className={styles.container} style={containerStyle}>
      <div
        className={styles.listWrapper}
        onScroll={updateScrollHint}
        ref={scrollContainerRef}
      >
        <div className={styles.list}>
          {meals.map((meal) => (
            <Link
              to={`/meal/${meal.id}`}
              key={meal.id}
              className={styles.itemLink}
            >
              <div className={styles.item}>
                <span className={styles.mealName}>{meal.name}</span>
                <span className={styles.mealDate}>
                  {new Date(meal.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}

          {isFetchingMore &&
            Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
              <MealItemPlaceholder key={`placeholder-${index}`} />
            ))}
          <div ref={ref} />
        </div>
      </div>
      <div
        className={`${styles.fadeOverlay} ${
          showScrollHint ? styles.visible : ""
        }`}
      />
    </div>
  );
};
