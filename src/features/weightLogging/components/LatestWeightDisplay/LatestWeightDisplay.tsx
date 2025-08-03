import { useMemo } from "react";
import { useGetWeightLogs } from "../../../../hooks/useGetWeightLogs";
import { MetricDisplayCard } from "../../../../components/layout/MetricDisplayCard/MetricDisplayCard";

const toYyyyMmDd = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const LatestWeightDisplay = () => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const { data: weightLogs, isLoading } = useGetWeightLogs(
    toYyyyMmDd(sevenDaysAgo),
    toYyyyMmDd(today)
  );

  const { latestWeight, sevenDayChange } = useMemo(() => {
    if (!weightLogs || weightLogs.length < 2) {
      const latest = weightLogs?.[0]?.weightKg ?? null;
      return { latestWeight: latest, sevenDayChange: null };
    }
    const sortedLogs = [...weightLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const latestLog = sortedLogs[sortedLogs.length - 1];
    const oldestLog = sortedLogs[0];
    const change = latestLog.weightKg - oldestLog.weightKg;
    return { latestWeight: latestLog.weightKg, sevenDayChange: change };
  }, [weightLogs]);

  return (
    <MetricDisplayCard
      title="Last Logged Weight"
      value={latestWeight}
      unit="kg"
      isLoading={isLoading}
      trend={
        sevenDayChange !== null
          ? { value: sevenDayChange, label: "7d change" }
          : undefined
      }
      trendDirection={
        sevenDayChange === null || sevenDayChange === 0
          ? undefined
          : sevenDayChange < 0
            ? "positive"
            : "negative"
      }
    />
  );
};

export default LatestWeightDisplay;
