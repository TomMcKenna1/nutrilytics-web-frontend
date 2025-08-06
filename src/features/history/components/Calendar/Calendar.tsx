import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
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
} from "../../../../utils/dateUtils";
import { getOverallDayStatus } from "../../utils/historyUtils";
import type { MonthlyData } from "../../types";
import type { NutritionTarget } from "../../../account/types";
import { DayDetailTooltip } from "./DayDetailTooltip";
import styles from "./Calendar.module.css";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  monthlyData: MonthlyData;
  targets: NutritionTarget | undefined;
}

export const Calendar = ({
  selectedDate,
  onDateSelect,
  monthlyData,
  targets,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(getStartOfMonth(new Date()));
  const today = new Date();

  const firstDayOfMonth = getStartOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const startingDayIndex =
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isNextMonthDisabled =
    isSameMonth(currentMonth, today) || currentMonth > today;

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <h2 className={styles.monthYear}>
          {formatDate(currentMonth, "MMMM yyyy")}
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
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className={styles.dayOfWeek}>
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`e-${i}`} className={styles.emptyCell} />
        ))}
        {daysInMonth.map((day) => {
          const isCurrentDay = isDateToday(day);
          const isPastDay = day < getEndOfDay(today) && !isCurrentDay;
          const isSelected =
            toLocalDateString(day) === toLocalDateString(selectedDate);

          const dayData = monthlyData?.[toLocalDateString(day)];
          const dayStatusClass = getOverallDayStatus(dayData, targets);

          const cellStyle = `${styles.dayCell} ${isCurrentDay ? styles.todayCell : isPastDay ? styles.pastCell : styles.futureCell}`;

          return (
            <div
              key={day.toString()}
              className={cellStyle}
              onClick={() => onDateSelect(day)}
            >
              <div className={styles.dayContent}>
                <span
                  className={`${styles.dayNumber} ${dayStatusClass} ${isSelected ? styles.selected : ""}`}
                >
                  {formatDate(day, "d")}
                </span>
                {dayData && (
                  <div className={styles.mealDotsContainer}>
                    {Array.from({ length: Math.min(dayData.mealCount, 5) }).map(
                      (_, i) => (
                        <div key={i} className={styles.mealDot} />
                      ),
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
