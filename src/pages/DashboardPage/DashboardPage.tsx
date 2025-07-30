import { Outlet } from "react-router-dom";
import DashboardNav from "../../features/dashboard/components/DashboardNav/DashboardNav";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardContainer}>
      <DashboardNav />
      <Outlet />
    </div>
  );
};

export default DashboardPage;
