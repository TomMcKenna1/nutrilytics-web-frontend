import { useMemo } from "react";
import { useTdeeHistory } from "../../../../hooks/useTdeeHistory";
import { MetricDisplayCard } from "../../../../components/layout/MetricDisplayCard/MetricDisplayCard";

export const LatestTDEE = () => {
  const { data, isLoading } = useTdeeHistory();

  const { latestTdee, sevenDayChange, confidenceLevel } = useMemo(() => {
    const validEntries = data?.filter((p) => p.data !== null) || [];
    if (validEntries.length === 0) {
      return { latestTdee: null, sevenDayChange: null, confidenceLevel: null };
    }
    const latestEntry = validEntries[validEntries.length - 1];
    const latestData = latestEntry.data!;
    const latestValue = latestData.estimatedTdeeKcal;

    let confidence: "high" | "medium" | "low" | null = null;
    const upperCi = latestData.upperBoundKcal;
    const lowerCi = latestData.lowerBoundKcal;
    if (upperCi && lowerCi) {
      const range = upperCi - lowerCi;
      if (range <= 150) confidence = "high";
      else if (range <= 300) confidence = "medium";
      else confidence = "low";
    }

    const sevenDaysAgoDate = new Date(latestEntry.date);
    sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 7);
    const sevenDaysAgoString = sevenDaysAgoDate.toISOString().split("T")[0];
    const sevenDayOldEntry = validEntries.find(
      (p) => p.date === sevenDaysAgoString,
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

  return (
    <MetricDisplayCard
      title="Current TDEE"
      value={latestTdee}
      unit="kcal"
      isLoading={isLoading}
      pill={
        confidenceLevel
          ? { text: `${confidenceLevel} confidence`, status: confidenceLevel }
          : undefined
      }
      trend={
        sevenDayChange !== null
          ? { value: sevenDayChange, label: "7d change" }
          : undefined
      }
      trendDirection={
        sevenDayChange === null || sevenDayChange === 0
          ? undefined
          : sevenDayChange > 0
            ? "positive"
            : "negative"
      }
    />
  );
};
