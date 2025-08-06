import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useWeightLogs } from "../../../../hooks/useWeightLogs";
import { useWeightForecast } from "../../../../hooks/useWeightForecast";
import * as dateUtils from "../../../../utils/dateUtils";
import styles from "./WeightTrendChart.module.css";

// A unified type for any point on the chart
type ChartPoint = {
  date: string; // ISO string
  weightKg: number;
  lowerBoundKg?: number;
  upperBoundKg?: number;
};

// A type for points after formatting for display
type FormattedPoint = {
  displayDate: string; // Formatted for the axis, e.g., "Aug 03"
  originalDate: string; // Keep the original ISO string for lookups
  data: ChartPoint | null;
};

const CustomTooltip = ({
  tooltipData,
}: {
  tooltipData: {
    x: number;
    y: number;
    point: FormattedPoint & { data: ChartPoint };
  } | null;
}) => {
  if (!tooltipData) return null;
  const { point, x, y } = tooltipData;
  const isPrediction = point.data.lowerBoundKg !== undefined;

  return (
    <div
      className={styles.tooltip}
      style={{
        left: x,
        top: y,
        opacity: 1,
        transform: "translate(-50%, -110%)",
      }}
    >
      <p className={styles.tooltipLabel}>{point.displayDate}</p>
      <p className={styles.tooltipItem}>
        <strong>{isPrediction ? "Predicted Weight:" : "Weight:"}</strong>{" "}
        {point.data.weightKg.toFixed(1)} kg
      </p>
    </div>
  );
};

export const WeightTrendChart = () => {
  const today = new Date();
  const startDate = dateUtils.toLocalDateString(dateUtils.addDays(today, -30));
  const endDate = dateUtils.toLocalDateString(today);

  const { data: historyData, isLoading: isLoadingHistory } = useWeightLogs(
    startDate,
    endDate,
  );
  const { data: forecastData, isLoading: isLoadingForecast } =
    useWeightForecast();

  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    point: FormattedPoint & { data: ChartPoint };
  } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (chartWrapperRef.current) {
        setDimensions({
          width: chartWrapperRef.current.clientWidth,
          height: chartWrapperRef.current.clientHeight,
        });
      }
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    if (chartWrapperRef.current) {
      resizeObserver.observe(chartWrapperRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const chartCalcs = useMemo(() => {
    const historicalPoints: ChartPoint[] = (historyData || []).map((log) => ({
      date: log.date,
      weightKg: log.weightKg,
    }));

    const forecastPoints: ChartPoint[] = (forecastData || []).map(
      (forecast) => ({
        date: forecast.date,
        weightKg: forecast.predictedWeightKg,
        lowerBoundKg: forecast.lowerBoundKg,
        upperBoundKg: forecast.upperBoundKg,
      }),
    );

    const combinedData = [...historicalPoints, ...forecastPoints].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const fullDateRange: FormattedPoint[] = [];
    if (combinedData.length > 0) {
      const dataMap = new Map<string, ChartPoint>();
      combinedData.forEach((p) => {
        const key = dateUtils.toLocalDateString(new Date(p.date));
        dataMap.set(key, p);
      });

      let currentDate = new Date(combinedData[0].date);
      const lastDate = new Date(combinedData[combinedData.length - 1].date);

      while (currentDate <= lastDate) {
        const key = dateUtils.toLocalDateString(currentDate);
        const matchingData = dataMap.get(key);
        fullDateRange.push({
          displayDate: currentDate.toLocaleString("default", {
            month: "short",
            day: "numeric",
          }),
          originalDate: currentDate.toISOString(),
          data: matchingData || null,
        });
        currentDate = dateUtils.addDays(currentDate, 1);
      }
    }

    const validData = fullDateRange.filter(
      (p): p is FormattedPoint & { data: ChartPoint } => p.data !== null,
    );
    const padding = { top: 10, bottom: 40, left: 50, right: 30 };

    if (validData.length < 2) {
      return {
        fullDateRange: [],
        validData: [],
        padding,
        historyPath: "",
        forecastPath: "",
        areaPath: "",
        chartWidth: 0,
        chartHeight: 0,
        yMin: 0,
        yMax: 0,
        getCoords: () => ({ x: 0, y: 0 }),
      };
    }

    const allValues = validData
      .flatMap((p) => [
        p.data.weightKg,
        p.data.lowerBoundKg,
        p.data.upperBoundKg,
      ])
      .filter((v) => v !== undefined) as number[];
    let yMin = Math.min(...allValues);
    let yMax = Math.max(...allValues);
    const yRange = yMax - yMin;
    yMin -= yRange * 0.2;
    yMax += yRange * 0.2;
    const chartWidth = dimensions.width - padding.left - padding.right;
    const chartHeight = dimensions.height - padding.top - padding.bottom;

    const getCoords = (value: number, originalIndex: number) => ({
      x:
        padding.left +
        (originalIndex / (fullDateRange.length - 1)) * chartWidth,
      y:
        padding.top +
        chartHeight -
        ((value - yMin) / (yMax - yMin)) * chartHeight,
    });

    const historyLine = validData.filter(
      (p) => p.data.lowerBoundKg === undefined,
    );
    const forecastLine = validData.filter(
      (p) => p.data.lowerBoundKg !== undefined,
    );
    const lastHistoryPoint = historyLine[historyLine.length - 1];

    const historyPath = historyLine
      .map((p, i) => {
        const index = fullDateRange.findIndex(
          (frp) => frp.originalDate === p.originalDate,
        );
        if (index === -1) return "";
        const { x, y } = getCoords(p.data.weightKg, index);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    const forecastPathData = lastHistoryPoint
      ? [lastHistoryPoint, ...forecastLine]
      : forecastLine;
    const forecastPath = forecastPathData
      .map((p, i) => {
        const index = fullDateRange.findIndex(
          (frp) => frp.originalDate === p.originalDate,
        );
        if (index === -1) return "";
        const { x, y } = getCoords(p.data.weightKg, index);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    // --- MODIFIED AREA PATH LOGIC ---
    let areaPath = "";
    if (lastHistoryPoint && forecastLine.length > 0) {
      const lastHistoryIndex = fullDateRange.findIndex(
        (frp) => frp.originalDate === lastHistoryPoint.originalDate,
      );
      // This is the single point where the history ends and the forecast begins.
      const jointPointCoords = getCoords(
        lastHistoryPoint.data.weightKg,
        lastHistoryIndex,
      );

      const upperPoints = forecastLine.map((p) => {
        const index = fullDateRange.findIndex(
          (frp) => frp.originalDate === p.originalDate,
        );
        return getCoords(p.data.upperBoundKg!, index);
      });

      const lowerPoints = forecastLine
        .map((p) => {
          const index = fullDateRange.findIndex(
            (frp) => frp.originalDate === p.originalDate,
          );
          return getCoords(p.data.lowerBoundKg!, index);
        })
        .reverse();

      // Start the path at the joint point, fan out to the bounds, and close it.
      const allAreaPoints = [jointPointCoords, ...upperPoints, ...lowerPoints];
      areaPath =
        "M " +
        allAreaPoints
          .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
          .join(" L ") +
        " Z";
    }
    // --- END OF MODIFICATION ---

    return {
      fullDateRange,
      validData,
      yMin,
      yMax,
      padding,
      historyPath,
      forecastPath,
      areaPath,
      chartWidth,
      chartHeight,
      getCoords,
    };
  }, [historyData, forecastData, dimensions]);

  const {
    fullDateRange,
    validData,
    yMin,
    yMax,
    padding,
    historyPath,
    forecastPath,
    areaPath,
    chartWidth,
    chartHeight,
    getCoords,
  } = chartCalcs;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (
      !fullDateRange ||
      fullDateRange.length === 0 ||
      !getCoords ||
      chartWidth === 0
    )
      return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const index = Math.round(
      ((mouseX - padding.left) / chartWidth) * (fullDateRange.length - 1),
    );
    const pointIndex = Math.max(0, Math.min(index, fullDateRange.length - 1));
    const point = fullDateRange[pointIndex];

    if (point && point.data) {
      const { x, y } = getCoords(point.data.weightKg, pointIndex);
      setTooltipData({
        x,
        y,
        point: point as FormattedPoint & { data: ChartPoint },
      });
    } else {
      setTooltipData(null);
    }
  };

  const renderContent = () => {
    if (isLoadingHistory || isLoadingForecast)
      return (
        <div className={styles.loadingContainer}>Loading Weight Data...</div>
      );
    if (!validData || validData.length < 2)
      return (
        <div className={styles.loadingContainer}>
          Not enough data for a trend.
        </div>
      );

    return (
      <>
        <svg
          width="100%"
          height="100%"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltipData(null)}
        >
          {/* Y-Axis Grid Lines & Labels */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = padding.top + (i / 4) * chartHeight;
            const value = yMax - (i / 4) * (yMax - yMin);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={dimensions.width - padding.right}
                  y2={y}
                  className={styles.gridLine}
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  className={styles.axisText}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* X-Axis Labels */}
          {fullDateRange.map((p, i) => {
            if (
              i % Math.floor(fullDateRange.length / 7) !== 0 &&
              i !== fullDateRange.length - 1
            )
              return null;
            const x =
              padding.left + (i / (fullDateRange.length - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={dimensions.height - padding.bottom / 2}
                className={styles.axisText}
                textAnchor="middle"
              >
                {p.displayDate}
              </text>
            );
          })}

          {/* Forecast Confidence Area */}
          <path
            d={areaPath}
            fill="var(--color-primary-blue)"
            fillOpacity={0.15}
          />

          {/* History Line */}
          <path
            d={historyPath}
            fill="none"
            stroke="var(--color-primary-blue)"
            strokeWidth={2.5}
          />

          {/* Forecast Line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="var(--color-primary-blue)"
            strokeWidth={2.5}
            strokeDasharray="4 4"
          />

          {/* Tooltip Elements */}
          {tooltipData && (
            <g>
              <line
                x1={tooltipData.x}
                y1={padding.top}
                x2={tooltipData.x}
                y2={dimensions.height - padding.bottom}
                stroke="var(--color-text-medium)"
                strokeDasharray="3 3"
              />
              <circle
                cx={tooltipData.x}
                cy={tooltipData.y}
                r={5}
                fill="var(--color-primary-blue)"
                stroke="white"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
        <CustomTooltip tooltipData={tooltipData} />
      </>
    );
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Weight Trend & Forecast</h3>
      <div className={styles.chartWrapper} ref={chartWrapperRef}>
        {renderContent()}
      </div>
    </div>
  );
};
