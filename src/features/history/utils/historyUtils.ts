import type { DailyHistoryLog } from "../types";
import type { NutritionTarget } from "../../account/types";
import styles from "../components/InfiniteHistoryCarousel/InfiniteHistoryCarousel.module.css";

/**
 * Determines the CSS class for the daily target ring based on energy intake.
 */
export const getOverallDayStatus = (
  dayData: DailyHistoryLog | undefined,
  targets: NutritionTarget | undefined
): string => {
  if (!dayData || !targets?.energy || dayData.mealCount === 0) {
    return "";
  }
  const { energy: consumed } = dayData.nutrition;
  const { energy: target } = targets;
  const difference = Math.abs(consumed - target);

  if (difference <= target * 0.1) return styles.ringGreen;
  if (difference <= target * 0.2) return styles.ringAmber;
  return styles.ringRed;
};
