import { Outlet } from "react-router-dom";
import TopBar from "../../common/TopBar/TopBar";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.appLayout}>
      <TopBar />
      <main className={styles.appMainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
