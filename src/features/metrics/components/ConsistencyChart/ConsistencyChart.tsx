import { useMemo } from "react";
import { useWeeklySummary } from "../../../../hooks/useWeeklySummary";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import { type NutrientSummary } from "../../types";
import styles from "./ConsistencyChart.module.css";
// --- NEW: Importing from the shared utility file ---
import { addDays, toLocalDateString } from "../../../../utils/dateUtils";

const NUTRIENT_OPTIONS: { key: keyof NutrientSummary; unit: string }[] = [
  { key: "energy", unit: "kcal" },
  { key: "protein", unit: "g" },
  { key: "carbohydrates", unit: "g" },
  { key: "fats", unit: "g" },
  { key: "sugars", unit: "g" },
  { key: "fibre", unit: "g" },
];

const NUTRIENT_COLORS: Record<keyof NutrientSummary, string> = {
  energy: "var(--color-energy)",
  protein: "var(--color-protein)",
  carbohydrates: "var(--color-carbs)",
  fats: "var(--color-fats)",
  sugars: "var(--color-sugars)",
  fibre: "var(--color-fibre)",
  saturatedFats: "var(--color-fats)",
  salt: "var(--color-text-medium)",
};

// --- NEW: Component now accepts its state via props ---
interface ConsistencyChartProps {
  currentMonday: Date;
  selectedNutrient: keyof NutrientSummary;
}

export const ConsistencyChart = ({ currentMonday, selectedNutrient }: ConsistencyChartProps) => {
  const { data: weeklyData, isLoading } = useWeeklySummary(currentMonday);
  const { targets } = useNutritionTargets();

  const chartData = useMemo(() => {
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentMonday, i));
    const targetValue = targets?.[selectedNutrient] ?? 0;

    const values = weekDays.map((day) => {
      const dayString = toLocalDateString(day);
      return weeklyData?.[dayString]?.[selectedNutrient] ?? 0;
    });

    const maxValue = Math.max(...values, targetValue);
    const yAxisMax = maxValue === 0 ? 100 : Math.ceil(maxValue * 1.2);

    const yAxisLabels = Array.from({ length: 5 }).map((_, i) => Math.round((yAxisMax / 4) * i));

    return { days: weekDays, values, targetValue, yAxisMax, yAxisLabels };
  }, [currentMonday, weeklyData, selectedNutrient, targets]);

  const selectedNutrientInfo = NUTRIENT_OPTIONS.find((n) => n.key === selectedNutrient);

  // --- REMOVED: All header/control JSX has been moved to the parent page ---
  return (
    <div className={styles.chartWrapper}>
      <div className={styles.yAxis}>
        {chartData.yAxisLabels.map((label) => <span key={label}>{label}</span>)}
      </div>
      <div className={styles.chartContent}>
        {isLoading && <p>Loading chart...</p>}
        {!isLoading && weeklyData && (
          <div className={styles.chartArea}>
            {chartData.targetValue > 0 && (
              <div
                className={styles.targetLine}
                style={{ bottom: `${(chartData.targetValue / chartData.yAxisMax) * 100}%` }}
              >
                <span className={styles.targetLabel}>
                  {`${chartData.targetValue} ${selectedNutrientInfo?.unit}`}
                </span>
              </div>
            )}
            {chartData.values.map((value, index) => (
              <div
                key={index}
                className={styles.bar}
                style={{
                  height: `${(value / chartData.yAxisMax) * 100}%`,
                  backgroundColor: NUTRIENT_COLORS[selectedNutrient],
                }}
              />
            ))}
          </div>
        )}
        <div className={styles.xAxis}>
          {chartData.days.map((day) => (
            <span key={day.toISOString()}>
              {day.toLocaleDateString("en-GB", { weekday: "short" })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};