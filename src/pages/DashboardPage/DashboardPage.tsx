import { MealList } from "../../features/meals/components/MealList/MealList";
import { DailySummary } from "../../features/metrics/components/DailySummary/DailySummary";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageHeader}>Today</h1>

      <section className={styles.summarySection}>
        <DailySummary />
      </section>

      <h2 className={styles.listHeader}>Recent Logs</h2>
      <MealList />
    </div>
  );
};

export default DashboardPage;
