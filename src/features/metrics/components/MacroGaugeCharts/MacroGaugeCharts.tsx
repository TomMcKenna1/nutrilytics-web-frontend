import { useMemo } from "react";
import { useWeeklySummary } from "../../../../hooks/useWeeklySummary";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import { type NutrientSummary } from "../../types";
import styles from "./MacroGaugeCharts.module.css";

// --- Date Helper Functions ---
const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

// --- A comprehensive list of all possible macros ---
const ALL_MACROS: {
  key: keyof NutrientSummary;
  title: string;
  unit: string;
}[] = [
  { key: "protein", title: "Protein", unit: "g" },
  { key: "carbohydrates", title: "Carbohydrates", unit: "g" },
  { key: "fats", title: "Fats", unit: "g" },
  { key: "energy", title: "Energy", unit: "kcal" },
  { key: "sugars", title: "Sugars", unit: "g" },
  { key: "fibre", title: "Fibre", unit: "g" },
  { key: "saturatedFats", title: "Saturated Fats", unit: "g" },
  { key: "salt", title: "Salt", unit: "g" },
];

type GaugeProps = {
  title: string;
  unit: string;
  average: number;
  target: number;
};

const SingleGauge = ({ title, unit, average, target }: GaugeProps) => {
  const gaugeData = useMemo(() => {
    if (target === 0) {
      return {
        needlePercent: 0,
        greenStartPercent: 0,
        greenWidthPercent: 0,
        isInTarget: false,
      };
    }
    const gaugeMax = target * 2;
    const buffer = 0.15;
    const greenMin = target * (1 - buffer);
    const greenMax = target * (1 + buffer);

    const greenStartPercent = (greenMin / gaugeMax) * 100;
    const greenWidthPercent = ((greenMax - greenMin) / gaugeMax) * 100;
    const needlePercent = Math.min((average / gaugeMax) * 100, 100);

    // --- NEW: Check if the average is within the green zone ---
    const isInTarget = average >= greenMin && average <= greenMax;

    return { needlePercent, greenStartPercent, greenWidthPercent, isInTarget };
  }, [average, target]);

  // --- NEW: Conditionally apply style class for the needle color ---
  const needleClasses = `${styles.needle} ${gaugeData.isInTarget ? styles.inRange : styles.outOfRange}`;

  return (
    <div className={styles.singleGauge}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.baseline}>
          Target: {Math.round(target)}
          {unit}
        </span>
      </div>
      <div className={styles.valueDisplay}>
        <span className={styles.currentValue}>{Math.round(average)}</span>
        <span className={styles.targetValue}>{unit} (7d Avg)</span>
      </div>
      <div className={styles.gaugeBar}>
        <div className={styles.gaugeBackground}></div>
        <div
          className={styles.segmentGood}
          style={{
            left: `${gaugeData.greenStartPercent}%`,
            width: `${gaugeData.greenWidthPercent}%`,
          }}
        />
        <div
          className={needleClasses}
          style={{ left: `${gaugeData.needlePercent}%` }}
        />
      </div>
    </div>
  );
};

interface MacroGaugeChartsProps {
  currentMonday: Date;
  selectedNutrient: keyof NutrientSummary;
}

export const MacroGaugeCharts = ({
  currentMonday,
  selectedNutrient,
}: MacroGaugeChartsProps) => {
  const { data: weeklyData, isLoading: isLoadingSummary } =
    useWeeklySummary(currentMonday);
  const { targets, isLoading: isLoadingTargets } = useNutritionTargets();

  const weeklyAverage = useMemo(() => {
    if (!weeklyData) return 0;
    const validDays = Object.values(weeklyData).filter((day) => day !== null);
    const dayCount = validDays.length || 1;
    const total = validDays.reduce(
      (acc, day) => acc + (day?.[selectedNutrient] ?? 0),
      0
    );
    return total / dayCount;
  }, [weeklyData, selectedNutrient]);

  const macroInfo = ALL_MACROS.find((m) => m.key === selectedNutrient);

  if (isLoadingSummary || isLoadingTargets) {
    return <div>Loading gauge...</div>;
  }

  return (
    <div className={styles.gaugesContainer}>
      {/* Now only renders the single gauge for the selected nutrient */}
      {macroInfo && (
        <SingleGauge
          title={macroInfo.title}
          unit={macroInfo.unit}
          average={weeklyAverage}
          target={targets?.[selectedNutrient] ?? 0}
        />
      )}
    </div>
  );
};
