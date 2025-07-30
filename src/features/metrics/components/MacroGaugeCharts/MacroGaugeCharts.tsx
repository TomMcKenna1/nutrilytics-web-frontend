import { useMemo } from "react";
import { useWeeklySummary } from "../../../../hooks/useWeeklySummary";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import { type NutrientSummary } from "../../types";
import styles from "./MacroGaugeCharts.module.css";
import { toLocalDateString } from "../../../../utils/dateUtils";

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

const STATUS_INFO = {
  inRange: { message: "In Range", className: styles.statusInRange },
  tooLow: { message: "Too Low", className: styles.statusOutOfRange },
  tooHigh: { message: "Too High", className: styles.statusOutOfRange },
};

const SingleGauge = ({ title, unit, average, target }: GaugeProps) => {
  const gaugeData = useMemo(() => {
    if (target === 0) {
      return {
        needlePercent: 0,
        greenStartPercent: 0,
        greenWidthPercent: 0,
        status: "inRange" as keyof typeof STATUS_INFO,
      };
    }
    const gaugeMax = target * 2;
    const buffer = 0.15;
    const greenMin = target * (1 - buffer);
    const greenMax = target * (1 + buffer);

    const greenStartPercent = (greenMin / gaugeMax) * 100;
    const greenWidthPercent = ((greenMax - greenMin) / gaugeMax) * 100;
    const needlePercent = Math.min((average / gaugeMax) * 100, 100);

    let status: keyof typeof STATUS_INFO = "inRange";
    if (average < greenMin) {
      status = "tooLow";
    } else if (average > greenMax) {
      status = "tooHigh";
    }

    return { needlePercent, greenStartPercent, greenWidthPercent, status };
  }, [average, target]);

  const isInTarget = gaugeData.status === "inRange";
  const needleClasses = `${styles.needle} ${isInTarget ? styles.inRange : styles.outOfRange}`;
  const statusInfo = STATUS_INFO[gaugeData.status];

  return (
    <div className={styles.singleGauge}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
          <span className={statusInfo.className}>{statusInfo.message}</span>
        </div>
        <span className={styles.baseline}>
          Target: {Math.round(target)}
          {unit}
        </span>
      </div>
      <div className={styles.valueDisplay}>
        <span className={styles.currentValue}>{Math.round(average)}</span>
        <span className={styles.targetValue}>{unit} (wk avg)</span>
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
    const todayString = toLocalDateString(new Date());
    const pastDays = Object.entries(weeklyData).filter(
      ([dateString, dayData]) => dayData !== null && dateString !== todayString
    );
    const dayCount = pastDays.length || 1;
    const total = pastDays.reduce(
      (acc, [, dayData]) => acc + (dayData?.[selectedNutrient] ?? 0),
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
