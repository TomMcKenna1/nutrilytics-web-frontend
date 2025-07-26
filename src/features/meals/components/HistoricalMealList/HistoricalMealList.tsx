import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useInfiniteMeals } from "../../../../hooks/useInfiniteMeals";
import type { MealResponse } from "../../types";
import MealItemPlaceholder from "../MealItemPlaceholder/MealItemPlaceholder";
import styles from "./HistoricalMealList.module.css";
import { FaBowlFood } from "react-icons/fa6";
import { RiDrinksFill } from "react-icons/ri";
import { GiChipsBag } from "react-icons/gi";

const ROW_HEIGHT_REM = 3.5;
const PLACEHOLDER_COUNT = 3;

// A simple, self-contained icon component to avoid adding new dependencies.
const MealTypeIcon = ({
  mealType,
}: {
  mealType: "meal" | "snack" | "beverage";
}) => {
  const iconStyle = {
    width: "1.25rem",
    height: "1.25rem",
    fill: "currentColor",
  };

  const icons = {
    meal: <FaBowlFood color={'var(--color-primary-blue)'}/>,
    snack: <GiChipsBag color={'var(--color-fats)'}/>,
    beverage: <RiDrinksFill color={'var(--color-fats)'}/>,
  };

  return icons[mealType] || icons.meal;
};

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
          {meals.map((meal: MealResponse) => (
            <Link
              to={`/meal/${meal.id}`}
              key={meal.id}
              className={styles.itemLink}
            >
              <div
                className={`${styles.item} ${
                  styles[meal.type] || styles.meal
                }`}
              >
                <div className={styles.mealInfo}>
                  <MealTypeIcon mealType={meal.type} />
                  <span className={styles.mealName}>{meal.name}</span>
                </div>
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
