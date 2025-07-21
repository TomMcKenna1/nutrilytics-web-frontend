import { MealDraftsList } from '../../features/meals/components/MealDraftsList';
import { HistoricalMealList } from '../../features/meals/components/HistoricalMealList/HistoricalMealList';
import { DailySummary } from '../../features/metrics/components/DailySummary/DailySummary';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageHeader}>Today</h1>

      <section className={styles.summarySection}>
        <DailySummary />
      </section>

      <h2 className={styles.listHeader}>Recent Generations</h2>
      <MealDraftsList />

      <h2 className={styles.listHeader}>Recent Logs</h2>
      <HistoricalMealList />
    </div>
  );
};

export default DashboardPage;