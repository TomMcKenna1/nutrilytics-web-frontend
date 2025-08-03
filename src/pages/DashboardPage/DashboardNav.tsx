import { NavLink } from "react-router-dom";
import styles from "./DashboardNav.module.css";

const DashboardNav = () => {
  return (
    <nav className={styles.navContainer}>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        end
      >
        Today
        <span className={styles.indicator}></span>
      </NavLink>
      <NavLink
        to="/dashboard/trends"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        end
      >
        Trends
        <span className={styles.indicator}></span>
      </NavLink>
      <NavLink
        to="/dashboard/history"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        History
        <span className={styles.indicator}></span>
      </NavLink>
    </nav>
  );
};

export default DashboardNav;
