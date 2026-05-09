import {
  format,
  isMatch,
  isValid,
  isThisWeek,
  isToday,
  isTomorrow,
  parseISO,
  addDays,
  startOfToday,
  isYesterday,
  isBefore,
  isSameYear,
  addWeeks,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";

import { IsoDate, Weekday } from "@/types/task.types";

/**
 * Finds the Saturday of the week where date belongs.
 * @param date The date to find the weekend for
 * @param weeksAhead Number of weeks ahead to get the weekend for, example: 0 for this weekend, 1 for next weekend, etc
 * @returns
 */
export const getWeekendSaturday = (date: IsoDate, weeksAhead = 0) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return addDays(addWeeks(weekStart, weeksAhead), 5);
};

/**
 * Returns the minimum date for a given type and selected date.
 * For start_date, it returns one day before the deadline; for deadline, it returns one day after the start date.
 * @param type The type of date to calculate the minimum for, either "start_date" or "deadline"
 * @param selectedDate The currently selected date to calculate the minimum against
 * @returns
 */
export const minDate = (
  type: "start_date" | "deadline",
  selectedDate: IsoDate | null,
) => {
  if (type === "start_date") {
    if (!selectedDate) return null;
    const maximumStartDate = addDays(parseISO(selectedDate), -1);
    return toIsoDate(maximumStartDate);
  }

  if (type === "deadline") {
    if (!selectedDate) return null;
    const minimumDeadlineDate = addDays(parseISO(selectedDate), 1);
    return toIsoDate(minimumDeadlineDate);
  }

  return null;
};

/**
 * Checks if a string is a valid ISO date.
 * @param value The string to validate
 * @returns
 */
export const isValidIsoDate = (value: string) => {
  return isMatch(value, "yyyy-MM-dd") && isValid(parseISO(value));
};

/**
 * Formats an ISO date into a shorter readable date.
 * If the date is in the current year, it returns "29 Apr"; otherwise it returns "29 Apr 2027".
 * @param date
 * @returns
 */
export const formatIsoDate = (date: IsoDate): string => {
  const parsedDate = parseISO(date);
  const isCurrentYear = parsedDate.getFullYear() === new Date().getFullYear();

  return format(parsedDate, isCurrentYear ? "d MMM" : "d MMM yyyy");
};

/**
 * Converts a Date object to an ISO date string.
 * @param date  The Date object to convert
 * @returns The ISO date string in the format "yyyy-MM-dd"
 */
export const toIsoDate = (date: Date): IsoDate => {
  return format(date, "yyyy-MM-dd") as IsoDate;
};

/**
 * Turns a date into a friendly label for UI.
 * It returns "Today", "Tomorrow", "Yesterday", weekday name like "Friday", or date like "29 Apr".
 * @param value  The ISO date string to format into a label
 * @returns The formatted date label
 */
export const getDateLabel = (value: IsoDate) => {
  const date = parseISO(value);
  const today = startOfToday();

  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  if (isBefore(date, today)) return format(date, "d MMM");
  if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, "EEEE");

  return format(date, "d MMM");
};

/**
 * Formats a date for a more detailed UI label.
 * If the date is this year, it returns "Wednesday 29 Apr"; otherwise "Wednesday 29 Apr 2027".
 * @param value  The date to format
 * @returns The formatted date string
 */
export const formatSmartUiDate = (value: Date | IsoDate) => {
  const date = typeof value === "string" ? parseISO(value) : value;

  return format(
    date,
    isSameYear(date, new Date()) ? "EEEE d MMM" : "EEEE d MMM yyyy",
  );
};

/**
 * Converts the time part of a Date into total minutes from midnight.
 * Example: 14:30 becomes 870 because 14 * 60 + 30 = 870.
 * @param date
 * @returns
 */
export const getStartTimeMin = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * Converts hours and minutes into total minutes.
 * Example: 1 hour 30 minutes = 90.
 * @param durationHours
 * @param durationMinutes
 * @returns
 */
export const getDurationMin = (
  durationHours: number,
  durationMinutes: number,
) => {
  if (durationHours === 0 && durationMinutes === 0) {
    return null;
  }

  return durationHours * 60 + durationMinutes;
};

/**
 * Converts total minutes back into { hours, minutes }.
 * Example: 870 becomes { hours: 14, minutes: 30 }.
 * @param totalMinutes
 * @returns
 */
export const getHoursAndMinutesFromMin = (totalMinutes: number | null) => {
  if (totalMinutes === null) return null;

  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  return {
    hours,
    minutes,
  };
};

/**
 * Formats total minutes into a time string.
 * Example: 870 becomes "2:30 PM" with 12-hour format, or "14:30" in 24-hour format.
 * @param totalMinutes Number of minutes from midnight
 * @param locale The locale string
 * @param is24Hour Whether to use 24-hour format or not
 * @returns
 */
export const formatTimeFromMin = (
  totalMinutes: number | null,
  locale: string,
  is24Hour: boolean,
) => {
  if (totalMinutes === null) return null;
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const date = new Date(0, 0, 0, hours, minutes);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: !is24Hour,
  }).format(date);
};

/**
 * Converts duration minutes into an object with total, hours, and minutes.
 * @param durationMin
 * @returns
 */
export const getDurationFromDurationMin = (durationMin: number | null) => {
  if (durationMin === null) return null;

  return {
    totalMinutes: durationMin,
    hours: Math.floor(durationMin / 60),
    minutes: durationMin % 60,
  };
};

/**
 * Converts a weekday number into a short English weekday name.
 * Example: 0 becomes "Mon", 1 becomes "Tue", assuming your app’s repeat system starts Monday at 0.
 * @param day The weekday number, where 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
 * @returns
 */
const formatRepeatWeekday = (day: Weekday) => {
  const repeatWeekStart = new Date(2024, 0, 1);
  return format(addDays(repeatWeekStart, day), "EEE", { locale: enUS });
};

/**
 * Turns selected repeat days into readable UI text.
 * Example: [0,1,2,3,4] becomes "Every weekday"
 * @param repeat The array of selected repeat days
 * @returns
 */
export const getRepeatLabel = (repeat: Weekday[] | null | undefined) => {
  if (!repeat?.length) return "Repeat";

  const days = [...new Set(repeat)].sort((a, b) => a - b);
  const value = days.join(",");

  if (value === "0,1,2,3,4,5,6") return "Every day";
  if (value === "0,1,2,3,4") return "Every weekday";
  if (value === "5,6") return "Every weekend";

  if (days.length === 1) {
    return `Every ${formatRepeatWeekday(days[0])}`;
  }

  return days.map(formatRepeatWeekday).join(", ");
};
