import React, { useState, useEffect, useRef } from "react";
import type { DailySummary as IDailySummary } from "../../../metrics/types";
import type { NutrientProfile } from "../../../meals/types";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import styles from "./DailyTargetImpact.module.css";

// In ms
const ANIMATION_DURATION = 1200;

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useAnimatedValue = (
  target: number,
  duration: number = ANIMATION_DURATION,
): number => {
  const [currentValue, setCurrentValue] = useState(0);
  const prevTarget = usePrevious(target);

  useEffect(() => {
    const fromValue = prevTarget ?? 0;
    if (fromValue === target) {
      setCurrentValue(target);
      return;
    }
    let animationFrameId: number;
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const animatedValue = fromValue + (target - fromValue) * progress;
      setCurrentValue(animatedValue);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(target);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return currentValue;
};

interface ProgressResult {
  currentProgress: number;
  totalProgress: number;
  overflowProgress: number;
}

const useAnimatedProgress = (
  currentValue: number,
  newValue: number,
  target: number,
  duration: number = ANIMATION_DURATION,
): ProgressResult => {
  const animatedNewValue = useAnimatedValue(newValue, duration);
  const animatedTotalValue = currentValue + animatedNewValue;
  const currentPercentage = target > 0 ? currentValue / target : 0;
  const animatedTotalPercentage = target > 0 ? animatedTotalValue / target : 0;

  return {
    currentProgress: Math.min(currentPercentage, 1),
    totalProgress: Math.min(animatedTotalPercentage, 1),
    overflowProgress: Math.max(0, animatedTotalPercentage - 1),
  };
};

interface NutrientCircleProps {
  label: string;
  value: number;
  newValue: number;
  target: number;
  unit: string;
  color: string;
}

const NutrientCircle: React.FC<NutrientCircleProps> = ({
  label,
  value,
  newValue,
  target,
  unit,
  color,
}) => {
  const animatedChange = useAnimatedValue(newValue);
  const finalTotalValue = value + newValue;

  const chart = {
    radius: 60,
    strokeWidth: 12,
    get circumference() {
      return 2 * Math.PI * this.radius;
    },
  };

  const { currentProgress, totalProgress, overflowProgress } =
    useAnimatedProgress(value, newValue, target);

  const currentOffset = chart.circumference * (1 - currentProgress);
  const totalOffset = chart.circumference * (1 - totalProgress);
  const overflowOffset = chart.circumference * (1 - overflowProgress);

  const isOverflowing = finalTotalValue > target;
  const impactColorVar = isOverflowing
    ? "--color-error"
    : "--color-nutrient-impact";
  const overflowAmount = finalTotalValue - target;

  return (
    <div className={styles.nutrientCircleContainer}>
      <svg className={styles.nutrientSvg} viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={chart.radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={chart.strokeWidth}
        />
        <circle
          cx="70"
          cy="70"
          r={chart.radius}
          fill="none"
          stroke={`var(${impactColorVar})`}
          strokeWidth={chart.strokeWidth}
          strokeDasharray={chart.circumference}
          strokeDashoffset={totalOffset}
          strokeLinecap="round"
        />
        <circle
          cx="70"
          cy="70"
          r={chart.radius}
          fill="none"
          stroke={`var(${color})`}
          strokeWidth={chart.strokeWidth}
          strokeDasharray={chart.circumference}
          strokeDashoffset={currentOffset}
          strokeLinecap="round"
        />
        {isOverflowing && (
          <circle
            cx="70"
            cy="70"
            r={chart.radius}
            fill="none"
            stroke={`var(${impactColorVar})`}
            strokeWidth={chart.strokeWidth}
            strokeDasharray={chart.circumference}
            strokeDashoffset={overflowOffset}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span className={styles.nutrientValue}>
        {(value + animatedChange).toFixed(0)}
        {unit}
      </span>
      <div className={styles.changeContainer}>
        <span
          className={styles.nutrientChange}
          style={{ color: `var(${impactColorVar})` }}
        >
          {animatedChange >= 0 ? "+" : ""}
          {animatedChange.toFixed(0)}
          {unit}
        </span>
        {isOverflowing && (
          <span className={styles.overflowText}>
            ({overflowAmount.toFixed(0)}
            {unit} over)
          </span>
        )}
      </div>
      <span className={styles.nutrientLabel}>{label}</span>
    </div>
  );
};

interface DailyTargetImpactProps {
  summary: IDailySummary;
  nutrientProfile: NutrientProfile;
}

export const DailyTargetImpact: React.FC<DailyTargetImpactProps> = ({
  summary,
  nutrientProfile,
}) => {
  const {
    targets,
    isLoading: targetsIsLoading,
    isError: targetsIsError,
    error: targetsError,
  } = useNutritionTargets();

  if (targetsIsLoading) return <p>Loading targets...</p>;
  if (targetsIsError)
    return (
      <p style={{ color: "red" }}>
        Error fetching targets: {(targetsError as Error)?.message}
      </p>
    );
  if (!targets) return <p>No target data available.</p>;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.nutrientsGrid}>
        <NutrientCircle
          label="Energy"
          value={summary.energy - nutrientProfile.energy}
          newValue={nutrientProfile.energy}
          target={targets.energy}
          unit="kcal"
          color="--color-energy"
        />
        <NutrientCircle
          label="Protein"
          value={summary.protein - nutrientProfile.protein}
          newValue={nutrientProfile.protein}
          target={targets.protein}
          unit="g"
          color="--color-protein"
        />
        <NutrientCircle
          label="Carbs"
          value={summary.carbohydrates - nutrientProfile.carbohydrates}
          newValue={nutrientProfile.carbohydrates}
          target={targets.carbohydrates}
          unit="g"
          color="--color-carbs"
        />
        <NutrientCircle
          label="Sugars"
          value={summary.sugars - nutrientProfile.sugars}
          newValue={nutrientProfile.sugars}
          target={targets.sugars}
          unit="g"
          color="--color-sugars"
        />
        <NutrientCircle
          label="Fat"
          value={summary.fats - nutrientProfile.fats}
          newValue={nutrientProfile.fats}
          target={targets.fats}
          unit="g"
          color="--color-fats"
        />
        <NutrientCircle
          label="Fibre"
          value={summary.fibre - nutrientProfile.fibre}
          newValue={nutrientProfile.fibre}
          target={targets.fibre}
          unit="g"
          color="--color-fibre"
        />
      </div>
    </div>
  );
};
