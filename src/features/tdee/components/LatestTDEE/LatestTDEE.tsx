import { useMemo } from "react";
import { useTdeeHistory } from "../../../../hooks/useTdeeHistory";
import styles from "./LatestTDEE.module.css";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

export const LatestTDEE = () => {
  const { data, isLoading, isError, error } = useTdeeHistory();

  const { latestTdee, sevenDayChange, confidenceLevel } = useMemo(() => {
    const validEntries = data?.filter((p) => p.data !== null) || [];
    if (validEntries.length === 0) {
      return { latestTdee: null, sevenDayChange: null, confidenceLevel: null };
    }

    const latestEntry = validEntries[validEntries.length - 1];
    const latestData = latestEntry.data!;
    const latestValue = latestData.estimatedTdeeKcal;

    // Calculate Confidence Level
    let confidence = null;
    const upperCi = latestData.upperBoundKcal;
    const lowerCi = latestData.lowerBoundKcal;
    if (upperCi && lowerCi) {
      const range = upperCi - lowerCi;
      if (range <= 150) confidence = "High";
      else if (range <= 300) confidence = "Medium";
      else confidence = "Low";
    }

    // Calculate 7-day change
    const sevenDaysAgoDate = new Date(latestEntry.date);
    sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 7);
    const sevenDaysAgoString = sevenDaysAgoDate.toISOString().split("T")[0];
    const sevenDayOldEntry = validEntries.find(
      (p) => p.date === sevenDaysAgoString
    );
    let change = null;
    if (sevenDayOldEntry?.data) {
      change = latestValue - sevenDayOldEntry.data.estimatedTdeeKcal;
    }

    return {
      latestTdee: latestValue,
      sevenDayChange: change,
      confidenceLevel: confidence,
    };
  }, [data]);

  const getChangeClassName = () => {
    if (sevenDayChange === null || sevenDayChange === 0) return styles.neutral;
    return sevenDayChange > 0 ? styles.positive : styles.negative;
  };

  const getConfidenceClassName = () => {
    if (!confidenceLevel) return "";
    switch (confidenceLevel) {
      case "High":
        return styles.highConfidence;
      case "Medium":
        return styles.mediumConfidence;
      case "Low":
        return styles.lowConfidence;
      default:
        return "";
    }
  };

  const renderContent = () => {
    if (isLoading)
      return <div className={styles.centeredMessage}>Loading...</div>;
    if (isError)
      return (
        <div className={`${styles.centeredMessage} ${styles.errorMessage}`}>
          {error.message}
        </div>
      );
    if (!latestTdee)
      return <div className={styles.centeredMessage}>No data found.</div>;

    return (
      <>
        <div className={styles.cardContent}>
          <span className={styles.mainValue}>{latestTdee.toFixed(0)}</span>
          <span className={styles.unitLabel}>kcal</span>
        </div>
        <div className={styles.cardFooter}>
          <p className={`${styles.changeValue} ${getChangeClassName()}`}>
            {sevenDayChange !== null && sevenDayChange !== 0 && (
              <>
                {sevenDayChange > 0 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
              </>
            )}
            <span>
              {sevenDayChange !== null
                ? `${sevenDayChange > 0 ? "+" : ""}${sevenDayChange.toFixed(
                    0
                  )} kcal`
                : "No change"}{" "}
              in last 7 days
            </span>
          </p>
        </div>
      </>
    );
  };

  return (
    <div className={styles.metricCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Current TDEE</h3>
        {confidenceLevel && (
          <p
            className={`${styles.confidenceIndicator} ${getConfidenceClassName()}`}
          >
            {confidenceLevel} confidence
          </p>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
