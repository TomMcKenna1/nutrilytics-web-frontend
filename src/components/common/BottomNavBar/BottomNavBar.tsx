import { NavLink } from "react-router-dom";
import styles from "./BottomNavBar.module.css";
import {
  IoHomeOutline,
  IoHome,
  IoTrendingUpOutline,
  IoTrendingUp,
  IoCalendarOutline,
  IoCalendar,
  IoPersonOutline,
  IoPerson,
  IoAdd,
} from "react-icons/io5";

interface BottomNavBarProps {
  onCenterButtonClick: () => void;
  isInputActive: boolean;
}

export const BottomNavBar = ({
  onCenterButtonClick,
  isInputActive,
}: BottomNavBarProps) => {
  return (
    <nav className={styles.navBar}>
      <div className={styles.navLinksContainer}>
        <NavLink to="/dashboard" end className={styles.navItem}>
          {({ isActive }) => (
            <>
              {isActive ? <IoHome /> : <IoHomeOutline />}
              <span>Today</span>
            </>
          )}
        </NavLink>
        <NavLink to="/dashboard/trends" className={styles.navItem}>
          {({ isActive }) => (
            <>
              {isActive ? <IoTrendingUp /> : <IoTrendingUpOutline />}
              <span>Trends</span>
            </>
          )}
        </NavLink>
        <div className={styles.navItemPlaceholder} />
        <NavLink to="/dashboard/history" className={styles.navItem}>
          {({ isActive }) => (
            <>
              {isActive ? <IoCalendar /> : <IoCalendarOutline />}
              <span>History</span>
            </>
          )}
        </NavLink>
        <NavLink to="/account" className={styles.navItem}>
          {({ isActive }) => (
            <>
              {isActive ? <IoPerson /> : <IoPersonOutline />}
              <span>Account</span>
            </>
          )}
        </NavLink>
      </div>
      <button
        className={`${styles.centerButton} ${
          isInputActive ? styles.closeActive : ""
        }`}
        onClick={onCenterButtonClick}
        aria-label={isInputActive ? "Close meal input" : "Log a new meal"}
      >
        <IoAdd className={styles.centerIcon} />
      </button>
    </nav>
  );
};
