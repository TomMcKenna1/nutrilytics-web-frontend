import React, { useState, useEffect } from "react";
import type { DailySummary as IDailySummary } from "../../../metrics/types";
import type { NutrientProfile } from "../../../meals/types";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import styles from "./DailyTargetImpact.module.css";

// In ms
const ANIMATION_DURATION = 1200;

const useCountUp = (
  target: number,
  isAnimating: boolean,
  duration: number = ANIMATION_DURATION,
): number => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isAnimating) {
      setCount(target);
      return;
    }
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

interface ProgressResult {
  currentProgress: number;
  totalProgress: number;
  overflowProgress: number;
}

const useAnimatedProgress = (
  isAnimating: boolean,
  currentValue: number,
  newValue: number,
  target: number,
  duration: number = ANIMATION_DURATION,
): ProgressResult => {
  const [animatedAddition, setAnimatedAddition] = useState(0);

  useEffect(() => {
    if (!isAnimating) {
      setAnimatedAddition(newValue);
      return;
    }
    let animationFrameId: number;
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedAddition(progress * newValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, newValue, duration]);

  const animatedTotalValue = currentValue + animatedAddition;
  const animatedTotalPercentage =
    target > 0 ? animatedTotalValue / target : 0;
  const currentPercentage = target > 0 ? currentValue / target : 0;

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
  isAnimating: boolean;
}

const NutrientCircle: React.FC<NutrientCircleProps> = ({
  label,
  value,
  newValue,
  target,
  unit,
  color,
  isAnimating,
}) => {
  const animatedNewValue = useCountUp(newValue, isAnimating);
  const finalTotalValue = value + newValue;

  const chart = {
    radius: 60,
    strokeWidth: 12,
    get circumference() {
      return 2 * Math.PI * this.radius;
    },
  };

  const { currentProgress, totalProgress, overflowProgress } =
    useAnimatedProgress(isAnimating, value, newValue, target);

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
        {/* Background track */}
        <circle
          cx="70"
          cy="70"
          r={chart.radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={chart.strokeWidth}
        />
        {/* Total value arc */}
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
        {/* Current value arc (normal color, drawn on top) */}
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
        {/* Overflow arc */}
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
      </svg>
      <span className={styles.nutrientValue}>
        {finalTotalValue.toFixed(0)}
        {unit}
      </span>
      <div className={styles.changeContainer}>
        <span
          className={styles.nutrientChange}
          style={{ color: `var(${impactColorVar})` }}
        >
          +{animatedNewValue.toFixed(0)}
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
  const startAnimation = useAnimationOnLoad();

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
        Error fetching targets: {targetsError?.message}
      </p>
    );
  if (!targets) return <p>No target data available.</p>;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.nutrientsGrid}>
        <NutrientCircle
          label="Energy"
          value={summary.energy}
          newValue={nutrientProfile.energy}
          target={targets.energy}
          unit="kcal"
          color="--color-energy"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Protein"
          value={summary.protein}
          newValue={nutrientProfile.protein}
          target={targets.protein}
          unit="g"
          color="--color-protein"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Carbs"
          value={summary.carbohydrates}
          newValue={nutrientProfile.carbohydrates}
          target={targets.carbohydrates}
          unit="g"
          color="--color-carbs"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Sugars"
          value={summary.sugars}
          newValue={nutrientProfile.sugars}
          target={targets.sugars}
          unit="g"
          color="--color-sugars"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Fat"
          value={summary.fats}
          newValue={nutrientProfile.fats}
          target={targets.fats}
          unit="g"
          color="--color-fats"
          isAnimating={startAnimation}
        />
        <NutrientCircle
          label="Fibre"
          value={summary.fibre}
          newValue={nutrientProfile.fibre}
          target={targets.fibre}
          unit="g"
          color="--color-fibre"
          isAnimating={startAnimation}
        />
      </div>
    </div>
  );
};