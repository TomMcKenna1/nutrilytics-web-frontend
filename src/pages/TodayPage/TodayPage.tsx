import { MealList } from "../../features/meals/components/MealList/MealList";
import { DailySummary } from "../../features/metrics/components/DailySummary/DailySummary";
import { LatestTDEE } from "../../features/tdee/components/LatestTDEE/LatestTDEE";
import WeightLog from "../../features/weightLogging/components/WeightLog/WeightLog";
import LatestWeightDisplay from "../../features/weightLogging/components/LatestWeightDisplay/LatestWeightDisplay";
import styles from "./TodayPage.module.css";
import { useDailySummary } from "../../hooks/useDailySummary";
import { useNutritionTargets } from "../../hooks/useNutritionTargets";

const DashboardSummaryPage = () => {
  const {
    data: summary,
    isLoading: summaryIsLoading,
    error: summaryError,
  } = useDailySummary();

  const {
    targets: targets,
    isLoading: targetsIsLoading,
    error: targetsError,
  } = useNutritionTargets();

  return (
    <>
      <section className={styles.summarySection}>
        <DailySummary
          summary={summary}
          targets={targets}
          isLoading={summaryIsLoading || targetsIsLoading}
          summaryError={summaryError}
          targetsError={targetsError}
        />
      </section>

      <div className={styles.keyMetricsRow}>
        <WeightLog />
        <LatestWeightDisplay />
        <LatestTDEE />
      </div>

      <h2 className={styles.listHeader}>Recent Logs</h2>
      <MealList />
    </>
  );
};

export default DashboardSummaryPage;
