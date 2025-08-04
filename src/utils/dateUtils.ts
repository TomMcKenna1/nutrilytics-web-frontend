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
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
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

/**
 * Formats a date object into a string.
 * Supports 'MMMM yyyy', 'd', 'yyyy-MM', and 'EEE'.
 */
export const formatDate = (
  date: Date,
  format: "MMMM yyyy" | "d" | "yyyy-MM" | "EEE" | "MMMM d, yyyy"
): string => {
  const options: Intl.DateTimeFormatOptions = {};
  switch (format) {
    case "MMMM yyyy":
      options.month = "long";
      options.year = "numeric";
      break;
    case "d":
      options.day = "numeric";
      break;
    case "yyyy-MM":
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    case "EEE":
      options.weekday = "short";
      break;
    case "MMMM d, yyyy":
      options.month = "long";
      options.day = "numeric";
      options.year = "numeric";
      break;
    default:
      return "";
  }
  return date.toLocaleDateString("en-US", options);
};

/**
 * Returns a new Date object for the first day of the given date's month.
 */
export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Returns an array of Date objects for each day in a given month.
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = new Date(year, month, 1);
  const days = [];
  while (day.getMonth() === month) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return days;
};

/**
 * Checks if two dates are in the same month and year.
 */
export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

/**
 * Returns a new Date object with the specified number of months added.
 */
export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

/**
 * Returns a new Date object with the specified number of months subtracted.
 */
export const subMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

/**
 * Returns a new Date object set to the end of the day.
 */
export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};
