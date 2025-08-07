import { useRef, useMemo, useState, useLayoutEffect, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { getMonthlySummary } from "../../../metrics/api/summaryService";
import {
  formatDate,
  isDateToday,
  toLocalDateString,
  getDaysInMonth,
  subMonths,
} from "../../../../utils/dateUtils";
import { getOverallDayStatus } from "../../utils/historyUtils";
import { DayItemPlaceholder } from "./DayItemPlaceholder";
import styles from "./InfiniteHistoryCarousel.module.css";
import type { NutritionTarget } from "../../../account/types";

const DAY_WIDTH = 80;

const getInitialMonthStrings = () => {
  const today = new Date();
  const currentMonth = formatDate(today, "yyyy-MM");
  const previousMonth = formatDate(subMonths(today, 1), "yyyy-MM");
  return [currentMonth, previousMonth];
};

interface InfiniteHistoryCarouselProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  targets: NutritionTarget | undefined;
}

export const InfiniteHistoryCarousel = ({
  selectedDate,
  onDateSelect,
  targets,
}: InfiniteHistoryCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef({ scrollLeft: 0, scrollWidth: 0 });

  const [visibleMonths, setVisibleMonths] = useState<string[]>(
    getInitialMonthStrings,
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const monthQueries = useQueries({
    queries: visibleMonths.map((month) => ({
      queryKey: ["monthlySummary", month],
      queryFn: () => getMonthlySummary(month),
      // 5 minutes
      staleTime: 5 * 60 * 1000,
    })),
  });

  const { combinedData, loadingMonths } = useMemo(() => {
    const data: { [key: string]: any } = {};
    const loading = new Set<string>();
    monthQueries.forEach((query, index) => {
      if (query.isLoading || query.isFetching) {
        loading.add(visibleMonths[index]);
      }
      if (query.data) {
        Object.assign(data, query.data);
      }
    });
    return { combinedData: data, loadingMonths: loading };
  }, [monthQueries, visibleMonths]);

  const days = useMemo(() => {
    let allDays: Date[] = [];
    visibleMonths.forEach((monthStr) => {
      const [year, month] = monthStr.split("-").map(Number);
      allDays.push(...getDaysInMonth(new Date(year, month - 1, 1)));
    });
    return allDays.sort((a, b) => a.getTime() - b.getTime());
  }, [visibleMonths]);

  useLayoutEffect(() => {
    if (carouselRef.current && visibleMonths.length <= 2) {
      carouselRef.current.scrollLeft = carouselRef.current.scrollWidth;
    } else if (
      carouselRef.current &&
      scrollPositionRef.current.scrollWidth > 0
    ) {
      const { scrollLeft, scrollWidth } = scrollPositionRef.current;
      const newScrollWidth = carouselRef.current.scrollWidth;
      if (newScrollWidth > scrollWidth) {
        carouselRef.current.scrollLeft =
          scrollLeft + (newScrollWidth - scrollWidth);
      }
    }
  }, [days]);

  useEffect(() => {
    if (carouselRef.current) {
      const selectedIndex = days.findIndex(
        (day) => toLocalDateString(day) === toLocalDateString(selectedDate),
      );
      if (selectedIndex !== -1) {
        const scrollPosition =
          selectedIndex * DAY_WIDTH -
          (carouselRef.current.offsetWidth - DAY_WIDTH) / 2;
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [selectedDate]);

  const handleScroll = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, offsetWidth } = carouselRef.current;

    const selectedIndex = days.findIndex(
      (day) => toLocalDateString(day) === toLocalDateString(today),
    );
    const maxScrollLeft =
      selectedIndex * DAY_WIDTH - (offsetWidth - DAY_WIDTH) / 2;
    if (scrollLeft > maxScrollLeft) {
      carouselRef.current.scrollLeft = maxScrollLeft;
    }
    if (scrollLeft < 200) {
      const oldestMonthString = visibleMonths[visibleMonths.length - 1];
      const [year, month] = oldestMonthString.split("-").map(Number);
      const oldestMonthDate = new Date(year, month - 1, 1);

      if (loadingMonths.has(oldestMonthString)) {
        return;
      }

      scrollPositionRef.current = {
        scrollLeft: carouselRef.current.scrollLeft,
        scrollWidth: carouselRef.current.scrollWidth,
      };

      const nextMonthToAdd = formatDate(
        subMonths(oldestMonthDate, 1),
        "yyyy-MM",
      );
      setVisibleMonths((prev) => [...prev, nextMonthToAdd]);
    }
  };

  return (
    <div
      className={styles.carouselContainer}
      ref={carouselRef}
      onScroll={handleScroll}
    >
      <div className={styles.carouselTrack}>
        {days.map((day) => {
          const dayMonth = formatDate(day, "yyyy-MM");
          if (loadingMonths.has(dayMonth)) {
            return <DayItemPlaceholder key={toLocalDateString(day)} />;
          }

          const isFutureDay = day > today;

          const dayData = combinedData[toLocalDateString(day)];
          const dayStatusClass = getOverallDayStatus(dayData, targets);
          const isSelected =
            toLocalDateString(day) === toLocalDateString(selectedDate);

          return (
            <div
              key={toLocalDateString(day)}
              className={`${styles.dayItem} ${
                isSelected ? styles.selected : ""
              } ${isFutureDay ? styles.futureDay : ""}`}
              onClick={() => !isFutureDay && onDateSelect(day)}
            >
              <div className={styles.dayOfWeek}>{formatDate(day, "EEE")}</div>
              <div className={`${styles.dayNumberContainer} ${dayStatusClass}`}>
                <span
                  className={`${styles.dayNumber} ${
                    isSelected ? styles.selected : ""
                  }`}
                >
                  {formatDate(day, "d")}
                </span>
              </div>
              <div className={styles.mealDotsContainer}>
                {dayData?.mealCount > 0 &&
                  Array.from({ length: Math.min(dayData.mealCount, 5) }).map(
                    (_, i) => <div key={i} className={styles.mealDot} />,
                  )}
              </div>
              {isDateToday(day) && (
                <div className={styles.todayIndicator}>Today</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
