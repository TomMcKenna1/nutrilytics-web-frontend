import { TDEEHistoryChart } from "../../features/tdee/components/TDEEHistoryChart/TDEEHistoryChart";
import { WeightTrendChart } from "../../features/weightLogging/components/WeightTrendChart/WeightTrendChart";
import styles from "./WeightTrends.module.css";

export const WeightTrends = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.trendsGrid}>
        <TDEEHistoryChart />
        <WeightTrendChart />
      </div>
    </div>
  );
};
