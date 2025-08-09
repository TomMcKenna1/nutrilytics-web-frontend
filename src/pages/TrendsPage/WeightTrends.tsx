import { useMediaQuery } from "../../hooks/useMediaQuery";
import { breakpoints } from "../../styles/breakpoints";
import { TDEEHistoryChart } from "../../features/tdee/components/TDEEHistoryChart/TDEEHistoryChart";
import { WeightTrendChart } from "../../features/weightLogging/components/WeightTrendChart/WeightTrendChart";
import MetricsCarousel from "../../components/common/MetricsCarousel/MetricsCarousel";
import styles from "./WeightTrends.module.css";

export const WeightTrends = () => {
  const isMobile = useMediaQuery(breakpoints.mobile);

  return (
    <div
      className={`${styles.pageContainer} ${
        isMobile ? styles.pageContainerMobile : ""
      }`}
    >
      {isMobile ? (
        <MetricsCarousel>
          <TDEEHistoryChart />
          <WeightTrendChart />
        </MetricsCarousel>
      ) : (
        <div className={styles.trendsGrid}>
          <TDEEHistoryChart />
          <WeightTrendChart />
        </div>
      )}
    </div>
  );
};
