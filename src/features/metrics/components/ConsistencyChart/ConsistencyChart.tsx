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
  { key: "sugars", unit: "g" },
  { key: "fibre", unit: "g" },
];

const NUTRIENT_COLORS: Record<keyof NutrientSummary, string> = {
  // var(--color-energy)
  energy: "hsl(38, 96%, 56%)",
  // var(--color-protein)
  protein: "hsl(340, 75%, 65%)",
  // var(--color-carbs)
  carbohydrates: "hsl(205, 80%, 65%)",
  // var(--color-fats)
  fats: "hsl(260, 65%, 68%)",
  // var(--color-sugars)
  sugars: "hsl(300, 70%, 70%)",
  // var(--color-fibre)
  fibre: "hsl(125, 55%, 55%)",
  // var(--color-fats)
  saturatedFats: "hsl(260, 65%, 68%)",
  // var(--color-text-medium)
  salt: "hsl(210, 10%, 55%)",
};

const STACK_LEGEND = [
  { name: "Meals", key: "meals" as const },
  { name: "Snacks", key: "snacks" as const },
  { name: "Beverages", key: "beverages" as const },
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

  const getStackColor = (
    nutrient: keyof NutrientSummary,
    stackType: "meals" | "snacks" | "beverages"
  ) => {
    const baseColor = NUTRIENT_COLORS[nutrient];
    // HSL colors to easily modify lightness for visual difference
    switch (stackType) {
      case "meals":
        return baseColor; // e.g., hsl(38, 96%, 56%)
      case "snacks":
        // Lighter
        return baseColor.replace(/,\s*([\d.]+)%\)/, ", 75%)");
      case "beverages":
        // Lightest
        return baseColor.replace(/,\s*([\d.]+)%\)/, ", 85%)");
      default:
        return baseColor;
    }
  };

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
                    className={styles.barSegment}
                    style={{
                      height: `${
                        (dayValue.beverages / chartData.yAxisMax) * 100
                      }%`,
                      backgroundColor: getStackColor(
                        selectedNutrient,
                        "beverages"
                      ),
                    }}
                  />
                  <div
                    className={styles.barSegment}
                    style={{
                      height: `${
                        (dayValue.snacks / chartData.yAxisMax) * 100
                      }%`,
                      backgroundColor: getStackColor(
                        selectedNutrient,
                        "snacks"
                      ),
                    }}
                  />
                  <div
                    className={styles.barSegment}
                    style={{
                      height: `${(dayValue.meals / chartData.yAxisMax) * 100}%`,
                      backgroundColor: getStackColor(selectedNutrient, "meals"),
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
              className={styles.legendColorBox}
              style={{
                backgroundColor: getStackColor(selectedNutrient, item.key),
              }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
