import React, { useState, useEffect, useRef } from "react";
import type { NutritionTarget } from "../../../account/types";
import { type DailySummary as IDailySummary } from "../../types";
import styles from "./DailySummary.module.css";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";
import { breakpoints } from "../../../../styles/breakpoints";

// In ms
const ANIMATION_DURATION = 1200;

/**
 * A custom hook to get the previous value of a prop or state.
 */
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * A custom hook that animates a count from a start value to an end value.
 */
const useCountUp = (
  startValue: number,
  endValue: number,
  isAnimating: boolean,
  duration: number = ANIMATION_DURATION
): number => {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    if (!isAnimating) {
      setCount(endValue);
      return;
    }

    if (startValue === endValue) {
      setCount(endValue);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number): void => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = startValue + progress * (endValue - startValue);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [startValue, endValue, isAnimating, duration]);

  return count;
};

const useAnimationOnLoad = (): boolean => {
  const [startAnimation, setStartAnimation] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStartAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return startAnimation;
};

type SequentialProgress = {
  mainProgress: number;
  overflowProgress: number;
};

/**
 * A custom hook that animates a progress value from a start to an end percentage,
 * correctly handling values over 100%.
 */
const useSequentialProgress = (
  isAnimating: boolean,
  startPercentage: number,
  finalPercentage: number,
  totalDuration: number = ANIMATION_DURATION
): SequentialProgress => {
  const [mainProgress, setMainProgress] = useState(
    Math.min(startPercentage, 1)
  );
  const [overflowProgress, setOverflowProgress] = useState(
    startPercentage > 1 ? startPercentage - 1 : 0
  );

  useEffect(() => {
    if (!isAnimating) {
      setMainProgress(Math.min(finalPercentage, 1));
      setOverflowProgress(finalPercentage > 1 ? finalPercentage - 1 : 0);
      return;
    }

    if (startPercentage === finalPercentage) {
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number): void => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      const currentPercentage =
        startPercentage + progress * (finalPercentage - startPercentage);

      setMainProgress(Math.min(currentPercentage, 1));
      setOverflowProgress(currentPercentage > 1 ? currentPercentage - 1 : 0);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setMainProgress(Math.min(finalPercentage, 1));
        setOverflowProgress(finalPercentage > 1 ? finalPercentage - 1 : 0);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, startPercentage, finalPercentage, totalDuration]);

  return { mainProgress, overflowProgress };
};

interface NutrientBarProps {
  label: string;
  previousValue: number;
  value: number;
  target: number;
  unit: string;
  color: string;
  isAnimating: boolean;
}

const NutrientBar: React.FC<NutrientBarProps> = ({
  label,
  previousValue,
  value,
  target,
  unit,
  color,
  isAnimating,
}) => {
  const animatedValue = useCountUp(previousValue, value, isAnimating);
  const startPercentage = target > 0 ? previousValue / target : 0;
  const finalPercentage = target > 0 ? value / target : 0;
  const { mainProgress } = useSequentialProgress(
    isAnimating,
    startPercentage,
    finalPercentage
  );

  const displayPercentage = Math.min(mainProgress, 1) * 100;

  return (
    <div className={styles.nutrientBarContainer}>
      <div className={styles.nutrientBarHeader}>
        <span className={styles.nutrientBarLabel}>{label}</span>
        <span className={styles.nutrientBarValue}>
          {animatedValue.toFixed(0)} / {target}
          {unit}
        </span>
      </div>
      <div className={styles.progressBarBackground}>
        <div
          className={styles.progressBarForeground}
          style={{
            width: `${displayPercentage}%`,
            backgroundColor: `var(${color})`,
          }}
          role="progressbar"
          aria-valuenow={animatedValue}
          aria-valuemin={0}
          aria-valuemax={target}
        />
      </div>
    </div>
  );
};

interface NutrientCircleProps {
  label: string;
  previousValue: number;
  value: number;
  target: number;
  unit: string;
  color: string;
  isAnimating: boolean;
}

const NutrientCircle: React.FC<NutrientCircleProps> = ({
  label,
  previousValue,
  value,
  target,
  unit,
  color,
  isAnimating,
}) => {
  const animatedValue = useCountUp(previousValue, value, isAnimating);

  const chart = {
    radius: 52,
    strokeWidth: 12,
    get circumference() {
      return 2 * Math.PI * this.radius;
    },
  };

  const startPercentage = target > 0 ? previousValue / target : 0;
  const finalPercentage = target > 0 ? value / target : 0;
  const { mainProgress, overflowProgress } = useSequentialProgress(
    isAnimating,
    startPercentage,
    finalPercentage
  );

  const mainOffset = chart.circumference * (1 - mainProgress);
  const overflowOffset = chart.circumference * (1 - overflowProgress);

  return (
    <div className={styles.nutrientCircleContainer}>
      <svg className={styles.nutrientSvg} viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={chart.radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={chart.strokeWidth}
        />
        <circle
          cx="60"
          cy="60"
          r={chart.radius}
          fill="none"
          stroke={`var(${color})`}
          strokeWidth={chart.strokeWidth}
          strokeDasharray={chart.circumference}
          strokeDashoffset={mainOffset}
          strokeLinecap="round"
        />
        <circle
          cx="60"
          cy="60"
          r={chart.radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth={chart.strokeWidth}
          strokeDasharray={chart.circumference}
          strokeDashoffset={overflowOffset}
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.nutrientValue}>
        {animatedValue.toFixed(0)}
        {unit}
      </span>
      <span className={styles.nutrientLabel}>{label}</span>
    </div>
  );
};

interface DailySummaryProps {
  summary?: IDailySummary;
  targets?: NutritionTarget;
  isLoading: boolean;
  summaryError?: Error | null;
  targetsError?: Error | null;
}

export const DailySummary: React.FC<DailySummaryProps> = ({
  summary,
  targets,
  isLoading,
  summaryError,
  targetsError,
}) => {
  const isMobile = useMediaQuery(breakpoints.mobile);
  const previousSummary = usePrevious(summary);
  const startAnimation = useAnimationOnLoad();

  if (isLoading) return <p>Loading summary...</p>;
  if (summaryError)
    return <p style={{ color: "red" }}>Error: {summaryError.message}</p>;
  if (targetsError)
    return (
      <p style={{ color: "red" }}>
        Error fetching targets: {targetsError?.message}
      </p>
    );
  if (!summary || !targets) return <p>No summary or target data available.</p>;

  const getPreviousValue = (key: keyof IDailySummary) => {
    return (previousSummary?.[key] as number) ?? 0;
  };

  const nutrientData = [
    {
      key: "energy",
      label: "Energy",
      unit: "kcal",
      color: "--color-energy",
    },
    {
      key: "protein",
      label: "Protein",
      unit: "g",
      color: "--color-protein",
    },
    {
      key: "carbohydrates",
      label: "Carbs",
      unit: "g",
      color: "--color-carbs",
    },
    { key: "sugars", label: "Sugars", unit: "g", color: "--color-sugars" },
    { key: "fats", label: "Fat", unit: "g", color: "--color-fats" },
    { key: "fibre", label: "Fibre", unit: "g", color: "--color-fibre" },
  ];

  return (
    <div className={styles.summaryContainer}>
      {isMobile ? (
        <div className={styles.mobileSummaryLayout}>
          <div className={styles.mobileMealsCountWrapper}>
            <div className={styles.mobileCountItem}>
              <span className={styles.mobileCountValuePrimary}>
                {summary.mealCount}
              </span>
              <span className={styles.mobileCountLabel}>Meals</span>
            </div>
            <div className={styles.mobileCountItem}>
              <span className={styles.mobileCountValue}>
                {summary.snackCount}
              </span>
              <span className={styles.mobileCountLabel}>Snacks</span>
            </div>
            <div className={styles.mobileCountItem}>
              <span className={styles.mobileCountValue}>
                {summary.beverageCount}
              </span>
              <span className={styles.mobileCountLabel}>Beverages</span>
            </div>
          </div>
          <div className={styles.nutrientList}>
            {nutrientData.map((nutrient) => (
              <NutrientBar
                key={nutrient.key}
                label={nutrient.label}
                previousValue={getPreviousValue(
                  nutrient.key as keyof IDailySummary
                )}
                value={summary[nutrient.key as keyof IDailySummary] as number}
                target={
                  targets[nutrient.key as keyof NutritionTarget] as number
                }
                unit={nutrient.unit}
                color={nutrient.color}
                isAnimating={startAnimation}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.mealsLoggedContainer}>
            <div className={styles.primaryCountContainer}>
              <span className={styles.mealsCount}>{summary.mealCount}</span>
              <span className={styles.mealsLabel}>Meals</span>
            </div>
            <div className={styles.secondaryCountsGrid}>
              <div className={styles.secondaryCount}>
                <span className={styles.secondaryCountValue}>
                  {summary.snackCount}
                </span>
                <span className={styles.secondaryCountLabel}>Snacks</span>
              </div>
              <div className={styles.secondaryCount}>
                <span className={styles.secondaryCountValue}>
                  {summary.beverageCount}
                </span>
                <span className={styles.secondaryCountLabel}>Beverages</span>
              </div>
            </div>
          </div>
          <div className={styles.nutrientsGrid}>
            {nutrientData.map((nutrient) => (
              <NutrientCircle
                key={nutrient.key}
                label={nutrient.label}
                previousValue={getPreviousValue(
                  nutrient.key as keyof IDailySummary
                )}
                value={summary[nutrient.key as keyof IDailySummary] as number}
                target={
                  targets[nutrient.key as keyof NutritionTarget] as number
                }
                unit={nutrient.unit}
                color={nutrient.color}
                isAnimating={startAnimation}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
