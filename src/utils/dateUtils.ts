import type { MealDB } from "../features/meals/types";

/**
 * Returns a new Date object for the Monday of the given date's week.
 * Sets the time to the beginning of the day.
 */
export const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
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

/**
 * Parses the flexible 'createdAt' field into a standard Date object.
 */
export const parseCreatedAt = (createdAt: MealDB["createdAt"]): Date | null => {
  if (!createdAt) return null;
  if (typeof createdAt === "string") {
    return new Date(createdAt);
  }
  if (typeof createdAt === "number") {
    return new Date(createdAt * 1000);
  }
  if (createdAt?._seconds) {
    return new Date(createdAt._seconds * 1000);
  }
  return null;
};

/**
 * Checks if a given Date object represents today's date.
 */
export const isDateToday = (date: Date | null): boolean => {
  if (!date) return false;
  const today = new Date();
  return date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
};

/**
 * Checks if a given Date object is within the current week (Monday-Sunday).
 */
export const isDateInCurrentWeek = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    // Uses other utils from this file to determine the week
    const currentWeekMondayString = toLocalDateString(getMonday(today));
    const dateMondayString = toLocalDateString(getMonday(d));
    return currentWeekMondayString === dateMondayString;
};