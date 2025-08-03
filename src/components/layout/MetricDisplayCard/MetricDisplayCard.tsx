import styles from "./MetricDisplayCard.module.css";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

type Status = "high" | "medium" | "low";
type TrendDirection = "positive" | "negative";

interface MetricDisplayCardProps {
  title: string;
  value: number | null;
  unit: string;
  isLoading: boolean;
  pill?: {
    text: string;
    status: Status;
  };
  trend?: {
    value: number;
    label: string;
  };
  trendDirection?: TrendDirection;
}

export const MetricDisplayCard = ({
  title,
  value,
  unit,
  isLoading,
  pill,
  trend,
  trendDirection,
}: MetricDisplayCardProps) => {
  const getPillClassName = () => {
    if (!pill) return "";
    switch (pill.status) {
      case "high":
        return styles.highConfidence;
      case "medium":
        return styles.mediumConfidence;
      case "low":
        return styles.lowConfidence;
      default:
        return "";
    }
  };

  const getTrendClassName = () => {
    if (!trendDirection) return styles.neutral;
    return trendDirection === "positive" ? styles.positive : styles.negative;
  };

  return (
    <div className={styles.metricCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {pill && (
          <p className={`${styles.pill} ${getPillClassName()}`}>{pill.text}</p>
        )}
      </div>

      <div className={styles.cardContent}>
        {isLoading ? (
          <span className={styles.mainValue}>...</span>
        ) : (
          <>
            <span className={styles.mainValue}>
              {value !== null ? value.toFixed(value % 1 === 0 ? 0 : 1) : "- -"}
            </span>
            <span className={styles.unitLabel}>{unit}</span>
          </>
        )}
      </div>

      <div className={styles.cardFooter}>
        {trend && (
          <p className={`${styles.trendValue} ${getTrendClassName()}`}>
            {trendDirection === "positive" && trend.value > 0 && <FaArrowTrendUp />}
            {trendDirection === "negative" && trend.value < 0 && <FaArrowTrendDown />}
            <span>
              {trend.value > 0 ? "+" : ""}
              {trend.value.toFixed(1)} {unit} ({trend.label})
            </span>
          </p>
        )}
      </div>
    </div>
  );
};