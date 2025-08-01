import { useState, useMemo } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useMonthlySummary } from "../../hooks/useMonthlySummary";
import { useNutritionTargets } from "../../hooks/useNutritionTargets";
import styles from "./CalendarPage.module.css";
import {
  formatDate,
  getStartOfMonth,
  getDaysInMonth,
  isDateToday,
  isSameMonth,
  addMonths,
  subMonths,
  getEndOfDay,
  toLocalDateString,
} from "../../utils/dateUtils";
import {
  type MonthlyNutritionLog,
  type NutrientSummary,
} from "../../features/metrics/types";
import { type NutritionTarget } from "../../features/account/types";
import GaugeBar from "../../features/metrics/components/GaugeBar/GaugeBar";
import { getNutrientZones } from "../../utils/macroZoneUtils";

const getCalorieStatusClass = (consumed: number, target: number): string => {
  if (!consumed || !target) return "";
  const ratio = consumed / target;
  if (ratio >= 0.9 && ratio <= 1.1) return styles.ringGreen;
  if (ratio > 1.25 || ratio < 0.75) return styles.ringRed;
  return styles.ringAmber;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const { data: monthlyData } = useMonthlySummary(currentDate);
  const { targets: targets } = useNutritionTargets();

  const firstDayOfMonth = getStartOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const startingDayIndex = firstDayOfMonth.getDay();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const isNextMonthDisabled =
    isSameMonth(currentDate, today) || currentDate.getTime() > today.getTime();

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <h2 className={styles.monthYear}>
          {formatDate(currentDate, "MMMM yyyy")}
        </h2>
        <div className={styles.navButtons}>
          <button onClick={handlePrevMonth} className={styles.navButton}>
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNextMonth}
            className={styles.navButton}
            disabled={isNextMonthDisabled}
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
      <div className={styles.grid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={styles.dayOfWeek}>
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className={styles.emptyCell} />
        ))}
        {daysInMonth.map((day) => {
          const isCurrentDay = isDateToday(day);
          const endOfToday = getEndOfDay(today);
          const isPastDay = day < endOfToday && !isCurrentDay;
          const isFutureDay = !isPastDay && !isCurrentDay;

          const dayData = monthlyData?.[toLocalDateString(day)];
          const calorieClass =
            dayData?.nutrition?.energy && targets
              ? getCalorieStatusClass(dayData.nutrition.energy, targets.energy)
              : "";

          const cellStyle = isCurrentDay
            ? styles.todayCell
            : isPastDay
              ? styles.pastCell
              : isFutureDay
                ? styles.futureCell
                : "";

          return (
            <div
              key={day.toString()}
              className={`${styles.dayCell} ${cellStyle}`}
            >
              <div className={styles.dayContent}>
                <span className={`${styles.dayNumber} ${calorieClass}`}>
                  {formatDate(day, "d")}
                </span>
                {dayData && (
                  <div className={styles.mealDotsContainer}>
                    {Array.from({ length: Math.min(dayData.mealCount, 5) }).map(
                      (_, i) => (
                        <div key={i} className={styles.mealDot} />
                      )
                    )}
                  </div>
                )}
              </div>
              {dayData && isPastDay && targets && (
                <DayDetailTooltip day={day} data={dayData} targets={targets} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayDetailTooltip = ({
  day,
  data,
  targets,
}: {
  day: Date;
  data: MonthlyNutritionLog;
  targets: NutritionTarget;
}) => {
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipHeader}>
        {day.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>

      <div className={styles.tooltipSection}>
        <strong>Daily Summary</strong>
        {Object.entries(targets).map(([key, targetValue]) => {
          const nutrientKey = key as keyof NutrientSummary;
          if (
            nutrientKey === "saturatedFats" ||
            nutrientKey === "sugars" ||
            nutrientKey === "fibre" ||
            nutrientKey === "salt"
          )
            return null;

          const consumed = data.nutrition[nutrientKey] || 0;
          return (
            <MacroGauge
              key={nutrientKey}
              nutrientKey={nutrientKey}
              consumed={consumed}
              target={targetValue}
            />
          );
        })}
      </div>

      <div className={styles.tooltipSection}>
        <strong>Meal Log</strong>
        <ul className={styles.logList}>
          {data.logs.map((log: string) => (
            <li key={log}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MacroGauge = ({
  nutrientKey,
  consumed,
  target,
}: {
  nutrientKey: keyof NutrientSummary;
  consumed: number;
  target: number;
}) => {
  const gaugeData = useMemo(() => {
    if (target === 0) {
      return {
        needlePercent: 0,
        greenZone: { start: 0, width: 0 },
        orangeZone: { start: 0, width: 0 },
        status: "inRange" as const,
      };
    }

    const gaugeMax = target * 2;
    const { dangerMin, warningMin, warningMax, dangerMax } = getNutrientZones(
      nutrientKey,
      target
    );

    const greenZone = {
      start: (warningMin / gaugeMax) * 100,
      width: ((warningMax - warningMin) / gaugeMax) * 100,
    };

    const orangeZone = {
      start: (dangerMin / gaugeMax) * 100,
      width: ((dangerMax - dangerMin) / gaugeMax) * 100,
    };

    let status: "inRange" | "warning" | "danger" = "danger";
    if (consumed >= warningMin && consumed <= warningMax) {
      status = "inRange";
    } else if (consumed >= dangerMin && consumed <= dangerMax) {
      status = "warning";
    }

    const needlePercent = Math.min((consumed / gaugeMax) * 100, 100);

    return { needlePercent, greenZone, orangeZone, status };
  }, [consumed, target, nutrientKey]);

  const unit = nutrientKey === "energy" ? "kcal" : "g";

  return (
    <div className={styles.macro}>
      <div className={styles.macroInfo}>
        <span>
          {nutrientKey.charAt(0).toUpperCase() + nutrientKey.slice(1)}
        </span>
        <p>
          {Math.round(consumed)} / {target} {unit}
        </p>
      </div>
      <GaugeBar
        needlePercent={gaugeData.needlePercent}
        greenZone={gaugeData.greenZone}
        orangeZone={gaugeData.orangeZone}
        status={gaugeData.status}
      />
    </div>
  );
};

export default Calendar;
