import { useMemo } from "react";
import { useWeeklySummary } from "../../../../hooks/useWeeklySummary";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import { type NutrientSummary } from "../../types";
import styles from "./ConsistencyChart.module.css";
import { addDays, toLocalDateString } from "../../../../utils/dateUtils";

const NUTRIENT_OPTIONS: { key: keyof NutrientSummary; unit: string }[] = [
  { key: "energy", unit: "kcal" },
  { key: "protein", unit: "g" },
  { key: "carbohydrates", unit: "g" },
  { key: "fats", unit: "g" },
  { key: "saturatedFats", unit: "g" },
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


const STACK_LEGEND = [
  { name: "Meals", key: "meal" as const },
  { name: "Snacks", key: "snack" as const },
  { name: "Beverages", key: "beverage" as const },
];

interface ConsistencyChartProps {
  currentMonday: Date;
  selectedNutrient: keyof NutrientSummary;
}

export const ConsistencyChart = ({
  currentMonday,
  selectedNutrient,
}: ConsistencyChartProps) => {
  const { data: weeklyData, isLoading } = useWeeklySummary(currentMonday);
  const { targets } = useNutritionTargets();

  const chartData = useMemo(() => {
    const weekDays = Array.from({ length: 7 }).map((_, i) =>
      addDays(currentMonday, i)
    );
    const targetValue = targets?.[selectedNutrient] ?? 0;

    const values = weekDays.map((day) => {
      const dayString = toLocalDateString(day);
      const dayData = weeklyData?.[dayString];
      const mealValue = dayData?.meals?.[selectedNutrient] ?? 0;
      const snackValue = dayData?.snacks?.[selectedNutrient] ?? 0;
      const beverageValue = dayData?.beverages?.[selectedNutrient] ?? 0;
      return {
        meals: mealValue,
        snacks: snackValue,
        beverages: beverageValue,
        total: mealValue + snackValue + beverageValue,
      };
    });

    const maxValue = Math.max(...values.map((v) => v.total), targetValue);
    const yAxisMax = maxValue === 0 ? 100 : Math.ceil(maxValue * 1.2);
    const yAxisLabels = Array.from({ length: 5 }).map((_, i) =>
      Math.round((yAxisMax / 4) * i)
    );

    return { days: weekDays, values, targetValue, yAxisMax, yAxisLabels };
  }, [currentMonday, weeklyData, selectedNutrient, targets]);

  const selectedNutrientInfo = NUTRIENT_OPTIONS.find(
    (n) => n.key === selectedNutrient
  );

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        <div className={styles.yAxis}>
          {chartData.yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className={styles.chartContent}>
          {isLoading && <p>Loading chart...</p>}
          {!isLoading && weeklyData && (
            <div className={styles.chartArea}>
              {chartData.targetValue > 0 && (
                <div
                  className={styles.targetLine}
                  style={{
                    bottom: `${
                      (chartData.targetValue / chartData.yAxisMax) * 100
                    }%`,
                  }}
                >
                  <span className={styles.targetLabel}>
                    {`${chartData.targetValue} ${selectedNutrientInfo?.unit}`}
                  </span>
                </div>
              )}
              {chartData.values.map((dayValue, index) => (
                <div key={index} className={styles.barStack}>
                  <div
                    className={`${styles.barSegment} ${styles.beverageSegment}`}
                    style={{
                      height: `${
                        (dayValue.beverages / chartData.yAxisMax) * 100
                      }%`,
                      backgroundColor: NUTRIENT_COLORS[selectedNutrient],
                    }}
                  />
                  <div
                    className={`${styles.barSegment} ${styles.snackSegment}`}
                    style={{
                      height: `${
                        (dayValue.snacks / chartData.yAxisMax) * 100
                      }%`,
                      backgroundColor: NUTRIENT_COLORS[selectedNutrient],
                    }}
                  />
                  <div
                    className={`${styles.barSegment} ${styles.mealSegment}`}
                    style={{
                      height: `${(dayValue.meals / chartData.yAxisMax) * 100}%`,
                      backgroundColor: NUTRIENT_COLORS[selectedNutrient],
                    }}
                  />
                </div>
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
      <div className={styles.legend}>
        {STACK_LEGEND.map((item) => (
          <div key={item.key} className={styles.legendItem}>
            <span
              className={`${styles.legendColorBox} ${
                styles[`${item.key}Segment`]
              }`}
              style={{
                backgroundColor: NUTRIENT_COLORS[selectedNutrient],
              }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
