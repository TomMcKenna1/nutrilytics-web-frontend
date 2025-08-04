import { useState } from "react";
import { useNutritionTargets } from "../../hooks/useNutritionTargets";
import { InfiniteHistoryCarousel } from "../../features/history/components/InfiniteHistoryCarousel/InfiniteHistoryCarousel";
import styles from "./HistoryPage.module.css";
import { formatDate } from "../../utils/dateUtils";

const normalizeDate = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const HistoryPage = () => {
  const [selectedDate, setSelectedDate] = useState(() =>
    normalizeDate(new Date())
  );
  const { targets } = useNutritionTargets();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(normalizeDate(date));
  };

  return (
    <div className={styles.pageContainer}>
      <InfiniteHistoryCarousel
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        targets={targets}
      />
      <div className={styles.detailsPlaceholder}>
        <h2>Showing details for: {formatDate(selectedDate, "MMMM d, yyyy")}</h2>
        <p>
          Meal logs and nutrition details for the selected day will appear here.
        </p>
      </div>
    </div>
  );
};

export default HistoryPage;
