import { Outlet } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import styles from "./DashboardPage.module.css";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { breakpoints } from "../../styles/breakpoints";

const DashboardPage = () => {
  const isMobile = useMediaQuery(breakpoints.mobile);

  return (
    <div className={styles.dashboardContainer}>
      {!isMobile && <DashboardNav />}
      <Outlet />
    </div>
  );
};

export default DashboardPage;
