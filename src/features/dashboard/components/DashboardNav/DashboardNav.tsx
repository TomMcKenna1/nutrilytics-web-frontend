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
        Insights
      </NavLink>
      <NavLink
        to="/dashboard/daily"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        end
      >
        Daily
      </NavLink>
      <NavLink
        to="/dashboard/calendar"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        Calendar
      </NavLink>
    </nav>
  );
};

export default DashboardNav;