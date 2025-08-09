import { useState, useMemo } from "react";
import styles from "./DateTimePicker.module.css";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface DateTimePickerProps {
  initialDateTime: Date;
  onChange: (newDate: Date) => void;
  onClose: () => void;
}

const DateTimePicker = ({
  initialDateTime,
  onChange,
  onClose,
}: DateTimePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialDateTime.getFullYear(), initialDateTime.getMonth())
  );

  const today = useMemo(() => new Date(), []);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      initialDateTime.getHours(),
      initialDateTime.getMinutes()
    );
    onChange(newDate > today ? today : newDate);
  };

  const handleTimeChange = (part: "hour" | "minute", value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    const newDate = new Date(initialDateTime);
    if (part === "hour") {
      newDate.setHours(numericValue);
    } else if (part === "minute") {
      newDate.setMinutes(numericValue);
    }

    onChange(newDate > today ? today : newDate);
  };

  // Click handler for the new "Now" button
  const handleSetToNow = () => {
    onChange(new Date());
    // Also update the calendar view to show the current month
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
  };

  const isFutureMonth = useMemo(() => {
    const todayMonth = new Date(today.getFullYear(), today.getMonth());
    return currentMonth >= todayMonth;
  }, [currentMonth, today]);

  const calendarGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`pad-start-${i}`}
          className={`${styles.day} ${styles.padding}`}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const todayDate = new Date(today); // Create a copy to avoid mutation

      const isFutureDay =
        dayDate.setHours(0, 0, 0, 0) > todayDate.setHours(0, 0, 0, 0);

      const isSelected =
        initialDateTime.getFullYear() === year &&
        initialDateTime.getMonth() === month &&
        initialDateTime.getDate() === day;
      const dayClasses = `${styles.day} ${isSelected ? styles.selected : ""} ${isFutureDay ? styles.disabled : ""}`;

      days.push(
        <button
          key={day}
          className={dayClasses}
          onClick={() => handleDayClick(day)}
          disabled={isFutureDay}
        >
          {day}
        </button>
      );
    }
    return days;
  }, [currentMonth, initialDateTime, today]);

  // BUG FIX: Create copies of dates for comparison to avoid mutating the prop.
  const isSelectedDateToday = useMemo(() => {
    const selectedDateCopy = new Date(initialDateTime);
    const todayCopy = new Date(today);
    return (
      selectedDateCopy.setHours(0, 0, 0, 0) === todayCopy.setHours(0, 0, 0, 0)
    );
  }, [initialDateTime, today]);

  return (
    <div className={styles.dateTimePickerContainer}>
      <div className={styles.calendarWrapper}>
        <div className={styles.header}>
          <button
            className={styles.navButton}
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <IoChevronBack />
          </button>
          <span className={styles.monthYear}>
            {currentMonth.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className={styles.navButton}
            onClick={handleNextMonth}
            aria-label="Next month"
            disabled={isFutureMonth}
          >
            <IoChevronForward />
          </button>
        </div>
        <div className={styles.calendarGrid}>
          <div className={styles.dayHeader}>S</div>
          <div className={styles.dayHeader}>M</div>
          <div className={styles.dayHeader}>T</div>
          <div className={styles.dayHeader}>W</div>
          <div className={styles.dayHeader}>T</div>
          <div className={styles.dayHeader}>F</div>
          <div className={styles.dayHeader}>S</div>
          {calendarGrid}
        </div>
        {/* NEW "Now" Button */}
        <div className={styles.calendarFooter}>
          <button className={styles.nowButton} onClick={handleSetToNow}>
            Now
          </button>
        </div>
      </div>

      <div className={styles.timePickerWrapper}>
        <h3 className={styles.timePickerTitle}>Time</h3>
        <div className={styles.timeInputsContainer}>
          <input
            type="number"
            className={styles.timeSegmentInput}
            value={String(initialDateTime.getHours()).padStart(2, "0")}
            onChange={(e) => handleTimeChange("hour", e.target.value)}
            max={isSelectedDateToday ? today.getHours() : 23}
            aria-label="Hour"
          />
          <span className={styles.timeSeparator}>:</span>
          <input
            type="number"
            className={styles.timeSegmentInput}
            value={String(initialDateTime.getMinutes()).padStart(2, "0")}
            onChange={(e) => handleTimeChange("minute", e.target.value)}
            max={
              isSelectedDateToday &&
              initialDateTime.getHours() === today.getHours()
                ? today.getMinutes()
                : 59
            }
            aria-label="Minute"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
