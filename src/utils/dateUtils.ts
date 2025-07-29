/**
 * Returns a new Date object for the Monday of the given date's week.
 * Sets the time to the beginning of the day.
 */
export const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  // diff is the number of days to subtract to get to Monday.
  // (day + 6) % 7 ensures Sunday (0) becomes a 6-day difference.
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0); // Reset time for consistency
  return date;
};

/**
 * Returns a new Date object with the specified number of days added.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Returns a date formatted as a 'YYYY-MM-DD' string, adjusted for the local timezone.
 * This avoids UTC conversion errors from `.toISOString()`.
 */
export const toLocalDateString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};