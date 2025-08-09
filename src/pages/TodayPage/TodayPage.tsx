import { MealList } from "../../features/meals/components/MealList/MealList";
import { DailySummary } from "../../features/metrics/components/DailySummary/DailySummary";
import { LatestTDEE } from "../../features/tdee/components/LatestTDEE/LatestTDEE";
import WeightLog from "../../features/weightLogging/components/WeightLog/WeightLog";
import LatestWeightDisplay from "../../features/weightLogging/components/LatestWeightDisplay/LatestWeightDisplay";
import styles from "./TodayPage.module.css";
import { useDailySummary } from "../../hooks/useDailySummary";
import { useNutritionTargets } from "../../hooks/useNutritionTargets";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { breakpoints } from "../../styles/breakpoints";
import MetricsCarousel from "../../components/common/MetricsCarousel/MetricsCarousel";

const DashboardSummaryPage = () => {
  const isMobile = useMediaQuery(breakpoints.mobile);
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
      {isMobile && <h1>Today</h1>}
      <section className={styles.summarySection}>
        <DailySummary
          summary={summary}
          targets={targets}
          isLoading={summaryIsLoading || targetsIsLoading}
          summaryError={summaryError}
          targetsError={targetsError}
        />
      </section>

      {isMobile ? (
        <MetricsCarousel>
          <LatestWeightDisplay />
          <LatestTDEE />
        </MetricsCarousel>
      ) : (
        <div className={styles.keyMetricsRow}>
          <WeightLog />
          <LatestWeightDisplay />
          <LatestTDEE />
        </div>
      )}

      <h2 className={styles.listHeader}>Recent Logs</h2>
      <MealList />
    </>
  );
};

export default DashboardSummaryPage;
