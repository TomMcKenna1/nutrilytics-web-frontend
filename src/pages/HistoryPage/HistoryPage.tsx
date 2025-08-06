import { useState } from "react";
import { useNutritionTargets } from "../../hooks/useNutritionTargets";
import { useDailySummary } from "../../hooks/useDailySummary";
import { InfiniteHistoryCarousel } from "../../features/history/components/InfiniteHistoryCarousel/InfiniteHistoryCarousel";
import { DailySummary } from "../../features/metrics/components/DailySummary/DailySummary";
import { MealList } from "../../features/meals/components/MealList/MealList";
import styles from "./HistoryPage.module.css";

const normalizeDate = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const HistoryPage = () => {
  const [selectedDate, setSelectedDate] = useState(() =>
    normalizeDate(new Date()),
  );

  const {
    targets: targets,
    isLoading: targetsIsLoading,
    error: targetsError,
  } = useNutritionTargets();

  const {
    data: summary,
    isLoading: summaryIsLoading,
    isFetching: summaryIsFetching,
    error: summaryError,
  } = useDailySummary(selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(normalizeDate(date));
  };

  const renderContent = () => {
    const isInitialLoading = summaryIsLoading || targetsIsLoading;
    if (isInitialLoading) {
      return (
        <div className={styles.statusContainer}>
          <p>Loading Details...</p>
        </div>
      );
    }

    if (summaryError || targetsError) {
      return (
        <div className={styles.statusContainer}>
          <p className={styles.errorText}>Could not load data for this day.</p>
        </div>
      );
    }

    if (!summary || summary.mealCount === 0) {
      return (
        <div className={styles.statusContainer}>
          <h2>No Meals Logged</h2>
          <p>There is no data to display for this day.</p>
        </div>
      );
    }

    return (
      <div className={styles.contentGrid}>
        <div className={styles.summaryContainer}>
          {summaryIsFetching && <div className={styles.subtleLoader} />}
          <DailySummary
            summary={summary}
            targets={targets}
            isLoading={isInitialLoading}
            summaryError={summaryError}
            targetsError={targetsError}
          />
        </div>
        <div className={styles.listContainer}>
          <h2 className={styles.containerHeader}>Logged Meals</h2>
          <MealList date={selectedDate} visibleRows={8} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <InfiniteHistoryCarousel
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        targets={targets}
      />
      {renderContent()}
    </div>
  );
};

export default HistoryPage;
