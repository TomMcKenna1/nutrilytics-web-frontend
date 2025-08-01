import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { MealList } from "../../features/meals/components/MealList/MealList";
import { ConsistencyChart } from "../../features/metrics/components/ConsistencyChart/ConsistencyChart";
import { DailySummary } from "../../features/metrics/components/DailySummary/DailySummary";
import { MacroGaugeCharts } from "../../features/metrics/components/MacroGaugeCharts/MacroGaugeCharts";
import { type NutrientSummary } from "../../features/metrics/types";
import { getMonday, addDays } from "../../utils/dateUtils";
import styles from "./DashboardSummaryPage.module.css";
import WeightLog from "../../features/weightLogging/components/WeightLog/WeightLog";

const NUTRIENT_OPTIONS: {
  key: keyof NutrientSummary;
  label: string;
}[] = [
  { key: "energy", label: "Energy" },
  { key: "protein", label: "Protein" },
  { key: "carbohydrates", label: "Carbs" },
  { key: "fats", label: "Fats" },
  { key: "saturatedFats", label: "Saturated Fats" },
  { key: "sugars", label: "Sugars" },
  { key: "fibre", label: "Fibre" },
];

const DashboardSummaryPage = () => {
  const [currentMonday, setCurrentMonday] = useState<Date>(
    getMonday(new Date())
  );
  const [selectedNutrient, setSelectedNutrient] =
    useState<keyof NutrientSummary>("energy");

  const handlePrevWeek = () => setCurrentMonday((prev) => addDays(prev, -7));
  const handleNextWeek = () => setCurrentMonday((prev) => addDays(prev, 7));

  const isNextWeekDisabled =
    currentMonday.getTime() >= getMonday(new Date()).getTime();

  const weekRange = `${currentMonday.toLocaleDateString("en-GB", { month: "short", day: "numeric" })} - ${addDays(currentMonday, 6).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <>
      <h1 className={styles.pageHeader}>Today</h1>
      <section className={styles.summarySection}>
        <DailySummary />
      </section>

      <WeightLog />

      <h2 className={styles.sectionSubtitle}>This week</h2>
      <section className={styles.summarySection}>
        <div className={styles.chartControlsHeader}>
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
        </div>

        <div className={styles.chartsContainer}>
          <div className={styles.barChartWrapper}>
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
      </section>

      <h2 className={styles.listHeader}>Recent Logs</h2>
      <MealList />
    </>
  );
};

export default DashboardSummaryPage;
