import styles from "./DayItemPlaceholder.module.css";

export const DayItemPlaceholder = () => {
  return (
    <div className={styles.placeholderContainer}>
      <div className={`${styles.shimmerBox} ${styles.dayOfWeek}`} />
      <div className={`${styles.shimmerCircle} ${styles.dayNumber}`} />
      <div className={`${styles.shimmerBox} ${styles.dots}`} />
    </div>
  );
};
