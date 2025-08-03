import styles from "./LatestWeightDisplay.module.css";

const LatestWeightDisplay = () => {
  return (
    <div className={styles.metricCard}>
      <h3 className={styles.cardTitle}>Last Logged Weight</h3>
      <div className={styles.cardContent}>
        <span className={styles.mainValue}>- -</span>
        <span className={styles.unitLabel}>kg</span>
      </div>
      <div className={styles.cardFooter}></div>
    </div>
  );
};

export default LatestWeightDisplay;