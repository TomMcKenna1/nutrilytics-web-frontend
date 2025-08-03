import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useTdeeHistory } from "../../../../hooks/useTdeeHistory";
import styles from "./TDEEHistoryChart.module.css";
import { type TDEEValues } from "../../types";

type ChartPoint = {
  date: string;
  originalDate: string;
  data: TDEEValues;
};

type FullRangePoint = {
  date: string;
  originalDate: string;
  data: TDEEValues | null;
};

const CustomTooltip = ({
  tooltipData,
}: {
  tooltipData: { x: number; y: number; point: ChartPoint } | null;
}) => {
  if (!tooltipData) return null;
  const { point, x, y } = tooltipData;
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
      <p className={styles.tooltipLabel}>{point.date}</p>
      <p className={styles.tooltipItem}>
        <strong>TDEE:</strong> {point.data.estimatedTdeeKcal.toFixed(0)} kcal
      </p>
      <p className={styles.tooltipItem}>
        <strong>Weight:</strong> {point.data.estimatedWeightKg.toFixed(1)} kg
      </p>
    </div>
  );
};

export const TDEEHistoryChart = () => {
  const { data, isLoading, isError, error } = useTdeeHistory();
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    point: ChartPoint;
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
    const padding = { top: 10, bottom: 40, left: 50, right: 30 };
    const fullRangeData: FullRangePoint[] = (data || []).map((p) => ({
      originalDate: p.date,
      date: new Date(p.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      }),
      data: p.data,
    }));
    const validData = fullRangeData.filter(
      (p): p is ChartPoint => p.data !== null
    );

    if (validData.length < 2) {
      return {
        fullRangeData,
        validData,
        padding,
        linePath: "",
        areaPath: "",
        chartWidth: 0,
        chartHeight: 0,
        yMin: 0,
        yMax: 0,
      };
    }

    const allValues = validData.flatMap((p) => [
      p.data.lowerBoundKcal,
      p.data.upperBoundKcal,
    ]);
    let yMin = Math.min(...allValues);
    let yMax = Math.max(...allValues);
    if (yMin === yMax) {
      yMin -= 50;
      yMax += 50;
    }
    const yRange = yMax - yMin;
    yMin -= yRange * 0.2;
    yMax += yRange * 0.2;

    const chartWidth = Math.max(
      0,
      dimensions.width - padding.left - padding.right
    );
    const chartHeight = Math.max(
      0,
      dimensions.height - padding.top - padding.bottom
    );

    if (chartWidth <= 0 || chartHeight <= 0) {
      return {
        fullRangeData,
        validData,
        padding,
        linePath: "",
        areaPath: "",
        chartWidth: 0,
        chartHeight: 0,
        yMin,
        yMax,
      };
    }

    const getCoords = (value: number, originalIndex: number) => {
      const x =
        padding.left +
        (originalIndex / (fullRangeData.length - 1)) * chartWidth;
      const y =
        padding.top +
        chartHeight -
        ((value - yMin) / (yMax - yMin)) * chartHeight;
      return { x, y };
    };

    const linePath = validData
      .map((p) =>
        getCoords(
          p.data.estimatedTdeeKcal,
          fullRangeData.findIndex((frp) => frp.originalDate === p.originalDate)
        )
      )
      .map(
        (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)},${p.y.toFixed(2)}`
      )
      .join(" ");

    const upperPoints = validData.map((p) =>
      getCoords(
        p.data.upperBoundKcal,
        fullRangeData.findIndex((frp) => frp.originalDate === p.originalDate)
      )
    );
    const lowerPoints = validData
      .map((p) =>
        getCoords(
          p.data.lowerBoundKcal,
          fullRangeData.findIndex((frp) => frp.originalDate === p.originalDate)
        )
      )
      .reverse();
    const areaPath =
      "M " +
      [...upperPoints, ...lowerPoints]
        .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" L ") +
      " Z";

    return {
      fullRangeData,
      validData,
      yMin,
      yMax,
      padding,
      linePath,
      areaPath,
      chartWidth,
      chartHeight,
    };
  }, [data, dimensions]);

  const {
    fullRangeData,
    validData,
    yMin,
    yMax,
    padding,
    linePath,
    areaPath,
    chartWidth,
    chartHeight,
  } = chartCalcs;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (fullRangeData.length === 0 || chartWidth === 0) return;

    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const index = Math.round(
      ((mouseX - padding.left) / chartWidth) * (fullRangeData.length - 1)
    );
    const pointIndex = Math.max(0, Math.min(index, fullRangeData.length - 1));
    const point = fullRangeData[pointIndex];

    if (point && point.data) {
      const y =
        padding.top +
        chartHeight -
        ((point.data.estimatedTdeeKcal - yMin) / (yMax - yMin)) * chartHeight;
      const x =
        padding.left + (pointIndex / (fullRangeData.length - 1)) * chartWidth;
      setTooltipData({ x, y, point: point as ChartPoint });
    } else {
      setTooltipData(null);
    }
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className={styles.loadingContainer}>Loading TDEE History...</div>
      );
    if (isError)
      return (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error: {error.message}</p>
        </div>
      );
    if (validData.length < 2)
      return (
        <div className={styles.loadingContainer}>
          Not enough data to display a trend.
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
                  textAnchor="end"
                  className={styles.axisText}
                  dominantBaseline="middle"
                >
                  {value.toFixed(0)}
                </text>
              </g>
            );
          })}

          {fullRangeData.map((p, i) => {
            if (
              i % Math.floor(fullRangeData.length / 5) !== 0 &&
              i !== fullRangeData.length - 1
            )
              return null;
            const x =
              padding.left + (i / (fullRangeData.length - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={dimensions.height - padding.bottom / 2}
                textAnchor="middle"
                className={styles.axisText}
                dominantBaseline="middle"
              >
                {p.date}
              </text>
            );
          })}

          <path
            d={areaPath}
            fill="var(--color-primary-blue)"
            fillOpacity={0.15}
          />
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-primary-blue)"
            strokeWidth={2.5}
          />

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
      <h3 className={styles.chartTitle}>TDEE Trend (Last 30 Days)</h3>
      <div className={styles.chartWrapper} ref={chartWrapperRef}>
        {renderContent()}
      </div>
    </div>
  );
};
