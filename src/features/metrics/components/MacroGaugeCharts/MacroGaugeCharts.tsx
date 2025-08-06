import { useMemo } from "react";
import { useWeeklySummary } from "../../../../hooks/useWeeklySummary";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import { type NutrientSummary, type WeeklyBreakdown } from "../../types";
import styles from "./MacroGaugeCharts.module.css";
import { toLocalDateString } from "../../../../utils/dateUtils";
import GaugeBar from "../GaugeBar/GaugeBar";
import { getNutrientZones } from "../../../../utils/macroZoneUtils";

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
  nutrientKey: keyof NutrientSummary;
};

const STATUS_INFO = {
  inRange: { message: "In Range", className: styles.statusInRange },
  tooLow: { message: "Too Low", className: styles.statusOutOfRange },
  tooHigh: { message: "Too High", className: styles.statusOutOfRange },
};

const SingleGauge = ({
  title,
  unit,
  average,
  target,
  nutrientKey,
}: GaugeProps) => {
  const gaugeData = useMemo(() => {
    if (target === 0) {
      return {
        needlePercent: 0,
        greenZone: { start: 0, width: 0 },
        orangeZone: { start: 0, width: 0 },
        status: "inRange" as const,
        needleStatus: "inRange" as const,
      };
    }

    const gaugeMax = target * 2;
    const { dangerMin, warningMin, warningMax, dangerMax, zoneType } =
      getNutrientZones(nutrientKey, target);

    const greenZone = {
      start: (warningMin / gaugeMax) * 100,
      width: ((warningMax - warningMin) / gaugeMax) * 100,
    };
    const orangeZone = {
      start: (dangerMin / gaugeMax) * 100,
      width: ((dangerMax - dangerMin) / gaugeMax) * 100,
    };

    let status:
      | "inRange"
      | "warningLow"
      | "warningHigh"
      | "dangerLow"
      | "dangerHigh" = "inRange";

    if (zoneType === "upperLimit") {
      if (average <= target) status = "inRange";
      else if (average <= dangerMax) status = "warningHigh";
      else status = "dangerHigh";
    } else {
      if (average >= warningMin && average <= warningMax) status = "inRange";
      else if (average >= dangerMin && average < warningMin)
        status = "warningLow";
      else if (average > warningMax && average <= dangerMax)
        status = "warningHigh";
      else if (average < dangerMin) status = "dangerLow";
      else status = "dangerHigh";
    }

    const needlePercent = Math.min((average / gaugeMax) * 100, 100);
    const needleStatus: "inRange" | "warning" | "danger" =
      status === "inRange"
        ? "inRange"
        : status.includes("warning")
          ? "warning"
          : "danger";

    return { needlePercent, greenZone, orangeZone, status, needleStatus };
  }, [average, target, nutrientKey]);

  const getStatusInfo = () => {
    if (gaugeData.status === "inRange") {
      return STATUS_INFO.inRange;
    }
    if (gaugeData.status.includes("Low")) {
      return STATUS_INFO.tooLow;
    }
    return STATUS_INFO.tooHigh;
  };

  const statusInfo = getStatusInfo();

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
      <GaugeBar
        needlePercent={gaugeData.needlePercent}
        greenZone={gaugeData.greenZone}
        orangeZone={gaugeData.orangeZone}
        status={gaugeData.needleStatus}
      />
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
      ([dateString, dayData]) => dayData !== null && dateString !== todayString,
    ) as [string, WeeklyBreakdown][];

    if (pastDays.length === 0) {
      return 0;
    }

    const total = pastDays.reduce((acc, [, dayData]) => {
      const mealValue = dayData.meals?.[selectedNutrient] ?? 0;
      const snackValue = dayData.snacks?.[selectedNutrient] ?? 0;
      const beverageValue = dayData.beverages?.[selectedNutrient] ?? 0;
      const dayTotal = mealValue + snackValue + beverageValue;
      return acc + dayTotal;
    }, 0);

    return total / pastDays.length;
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
          nutrientKey={macroInfo.key}
        />
      )}
    </div>
  );
};
