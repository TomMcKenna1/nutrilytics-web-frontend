import { LatestTDEE } from "../LatestTDEE/LatestTDEE";
import { TDEEHistoryChart } from "../TDEEHistoryChart/TDEEHistoryChart";
import styles from "./TDEEDashboard.module.css";

export const TDEEDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <aside>
        <LatestTDEE />
      </aside>
      <main>
        <TDEEHistoryChart />
      </main>
    </div>
  );
};
