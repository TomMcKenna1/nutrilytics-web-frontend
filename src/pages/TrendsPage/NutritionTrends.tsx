import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { type NutrientSummary } from "../../features/metrics/types";
import { addDays, getMonday } from "../../utils/dateUtils";
import { ConsistencyChart } from "../../features/metrics/components/ConsistencyChart/ConsistencyChart";
import { MacroGaugeCharts } from "../../features/metrics/components/MacroGaugeCharts/MacroGaugeCharts";
import styles from "./NutritionTrends.module.css";

const NUTRIENT_OPTIONS: { key: keyof NutrientSummary; label: string }[] = [
  { key: "energy", label: "Energy" },
  { key: "protein", label: "Protein" },
  { key: "carbohydrates", label: "Carbs" },
  { key: "fats", label: "Fats" },
  { key: "saturatedFats", label: "Saturated Fats" },
  { key: "sugars", label: "Sugars" },
  { key: "fibre", label: "Fibre" },
  { key: "salt", label: "Salt" },
];

export const NutritionTrends = () => {
  const [currentMonday, setCurrentMonday] = useState<Date>(
    getMonday(new Date())
  );
  const [selectedNutrient, setSelectedNutrient] =
    useState<keyof NutrientSummary>("energy");

  const handlePrevWeek = () => setCurrentMonday((prev) => addDays(prev, -7));
  const handleNextWeek = () => setCurrentMonday((prev) => addDays(prev, 7));

  const isNextWeekDisabled =
    currentMonday.getTime() >= getMonday(new Date()).getTime();

  const weekRange = `${currentMonday.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  })} - ${addDays(currentMonday, 6).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <select
          className={styles.nutrientSelect}
          value={selectedNutrient}
          onChange={(e) =>
            setSelectedNutrient(e.target.value as keyof NutrientSummary)
          }
        >
          {NUTRIENT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.dateControls}>
          <button onClick={handlePrevWeek} className={styles.navButton}>
            <FaAngleLeft />
          </button>
          <span className={styles.dateRange}>{weekRange}</span>
          <button
            onClick={handleNextWeek}
            className={styles.navButton}
            disabled={isNextWeekDisabled}
          >
            <FaAngleRight />
          </button>
        </div>
      </header>

      <div className={styles.chartsGrid}>
        <div className={styles.consistencyChartWrapper}>
          <ConsistencyChart
            currentMonday={currentMonday}
            selectedNutrient={selectedNutrient}
          />
        </div>
        <div className={styles.gaugeChartWrapper}>
          <MacroGaugeCharts
            currentMonday={currentMonday}
            selectedNutrient={selectedNutrient}
          />
        </div>
      </div>
    </div>
  );
};
