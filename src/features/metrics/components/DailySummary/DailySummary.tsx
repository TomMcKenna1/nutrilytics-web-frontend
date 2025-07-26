import React, { useState, useEffect } from "react";
import { getDailySummary } from "../../api/summaryService";
import { type DailySummary as IDailySummary } from "../../types";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import styles from "./DailySummary.module.css";

// In ms
const ANIMATION_DURATION = 1200;

const useCountUp = (
  target: number,
  isAnimating: boolean,
  duration: number = ANIMATION_DURATION
): number => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isAnimating) return;
    let animationFrameId: number;
    let start = 0;
    const animate = (timestamp: number): void => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      const current = Math.min(progress * target, target);
      setCount(current);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, isAnimating, duration]);
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

const useSequentialProgress = (
  isAnimating: boolean,
  finalPercentage: number,
  totalDuration: number = ANIMATION_DURATION
): SequentialProgress => {
  const [mainProgress, setMainProgress] = useState(0);
  const [overflowProgress, setOverflowProgress] = useState(0);

  useEffect(() => {
    if (!isAnimating || finalPercentage === 0) return;
    let animationFrameId: number;

    const targetMain = Math.min(finalPercentage, 1);
    const targetOverflow = finalPercentage > 1 ? finalPercentage - 1 : 0;

    const mainDuration = totalDuration * (targetMain / finalPercentage);
    const overflowDuration = totalDuration * (targetOverflow / finalPercentage);

    let start: number | null = null;
    const animate = (timestamp: number): void => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed <= mainDuration) {
        const progress = elapsed / mainDuration;
        setMainProgress(progress * targetMain);
      } else {
        setMainProgress(targetMain);
      }

      if (
        targetOverflow > 0 &&
        elapsed > mainDuration &&
        elapsed <= totalDuration
      ) {
        const overflowElapsed = elapsed - mainDuration;
        const progress = overflowElapsed / overflowDuration;
        setOverflowProgress(progress * targetOverflow);
      } else if (targetOverflow > 0 && elapsed > totalDuration) {
        setOverflowProgress(targetOverflow);
      }

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, finalPercentage, totalDuration]);

  return { mainProgress, overflowProgress };
};

interface NutrientCircleProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  isAnimating: boolean;
}

const NutrientCircle: React.FC<NutrientCircleProps> = ({
  label,
  value,
  target,
  unit,
  color,
  isAnimating,
}) => {
  const animatedValue = useCountUp(value, isAnimating);

  const chart = {
    radius: 52,
    strokeWidth: 12,
    get circumference() {
      return 2 * Math.PI * this.radius;
    },
  };

  const finalPercentage = target > 0 ? value / target : 0;
  const { mainProgress, overflowProgress } = useSequentialProgress(
    isAnimating,
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

export const DailySummary: React.FC = () => {
  const [summary, setSummary] = useState<IDailySummary | null>(null);
  const [summaryIsLoading, setSummaryIsLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const startAnimation = useAnimationOnLoad();

  const {
    targets,
    isLoading: targetsIsLoading,
    isError: targetsIsError,
    error: targetsError,
  } = useNutritionTargets();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDailySummary();
        setSummary(data);
      } catch (err) {
        setSummaryError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setSummaryIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (summaryIsLoading || targetsIsLoading) return <p>Loading summary...</p>;
  if (summaryError)
    return <p style={{ color: "red" }}>Error: {summaryError}</p>;
  if (targetsIsError)
    return (
      <p style={{ color: "red" }}>
        Error fetching targets: {targetsError?.message}
      </p>
    );
  if (!summary || !targets) return <p>No summary or target data available.</p>;

  return (
    <div className={styles.summaryContainer}>
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
        <NutrientCircle
          label="Energy"
          value={summary.energy}
          target={targets.energy}
          unit="kcal"
          color="--color-energy"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Protein"
          value={summary.protein}
          target={targets.protein}
          unit="g"
          color="--color-protein"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Carbs"
          value={summary.carbohydrates}
          target={targets.carbohydrates}
          unit="g"
          color="--color-carbs"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Sugars"
          value={summary.sugars}
          target={targets.sugars}
          unit="g"
          color="--color-sugars"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Fat"
          value={summary.fats}
          target={targets.fats}
          unit="g"
          color="--color-fats"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Fibre"
          value={summary.fibre}
          target={targets.fibre}
          unit="g"
          color="--color-fibre"
          isAnimating={startAnimation}
        />
      </div>
    </div>
  );
};
