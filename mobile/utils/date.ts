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
  getISODay,
} from "date-fns";
import { enUS } from "date-fns/locale";

import { IsoDate, Weekday } from "@/types/task.types";

/**
 * Finds the Saturday of the week where date belongs.
 * @param date The date to find the weekend for
 * @param weeksAhead Number of weeks ahead to get the weekend for, example: 0 for this weekend, 1 for next weekend, etc
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
 */
export const isValidIsoDate = (value: string) => {
  return isMatch(value, "yyyy-MM-dd") && isValid(parseISO(value));
};

/**
 * Formats an ISO date into a shorter readable date.
 * If the date is in the current year, it returns "29 Apr"; otherwise it returns "29 Apr 2027".
 * @param date
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
 */
export const getStartTimeMin = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * Converts hours and minutes into total minutes.
 * Example: 1 hour 30 minutes = 90.
 * @param durationHours
 * @param durationMinutes
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
 */
export const getDurationFromDurationMin = (
  durationMin: number | null,
): {
  totalMinutes: number;
  hours: number;
  minutes: number;
} | null => {
  if (durationMin === null) return null;

  return {
    totalMinutes: durationMin,
    hours: Math.floor(durationMin / 60),
    minutes: durationMin % 60,
  };
};

/**
 * Converts a weekday number into a short English weekday name.
 * Example: 0 becomes "Mon", 1 becomes "Tue"
 * @param day The weekday number, where 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
 */
const formatRepeatWeekday = (day: Weekday) => {
  const repeatWeekStart = new Date(2024, 0, 1);
  return format(addDays(repeatWeekStart, day), "EEE", { locale: enUS });
};

/**
 * Turns selected repeat days into readable UI text.
 * Example: [0,1,2,3,4] becomes "Every weekday"
 * @param repeat The array of selected repeat days
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

export const getRepeatWeekdayIndex = (date: Date): Weekday => {
  return ((getISODay(date) + 6) % 7) as Weekday;
};

/**
 * Returns the closest date on which a task should repeat.
 *
 * @param repeat Selected repeat weekdays, where 0 = Monday and 6 = Sunday
 * @param fromDate Date from which to calculate
 * @param includeFromDate Whether today can be returned when it matches
 */
export const getNextRepeatDate = (
  repeat: Weekday[] | null | undefined,
  fromDate: Date = new Date(),
  includeFromDate = true,
): IsoDate | null => {
  if (!repeat?.length) return null;

  const currentWeekday = getRepeatWeekdayIndex(fromDate);
  const uniqueDays = [...new Set(repeat)];

  const closestOffset = Math.min(
    ...uniqueDays.map((repeatDay) => {
      const offset = (repeatDay - currentWeekday + 7) % 7;

      if (!includeFromDate && offset === 0) {
        return 7;
      }

      return offset;
    }),
  );

  return toIsoDate(addDays(fromDate, closestOffset));
};

/**
 * Converts minutes from midnight into a Date suitable for a time picker.
 * When no time is provided, it returns the current time.
 */
export const getTimePickerDate = (startTimeMin: number | null): Date => {
  const date = new Date();

  if (startTimeMin !== null) {
    const hours = Math.floor(startTimeMin / 60);
    const minutes = startTimeMin % 60;

    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  const minuteStep = 5;
  const currentTimeMin = date.getHours() * 60 + date.getMinutes();
  const roundedTimeMin = Math.min(
    Math.ceil(currentTimeMin / minuteStep) * minuteStep,
    23 * 60 + 55,
  );

  date.setHours(Math.floor(roundedTimeMin / 60), roundedTimeMin % 60, 0, 0);

  return date;
};

/**
 * Turns duration minutes into a UI label.
 * Examples: 260 becomes "4h 20m", 20 becomes "20m", and 240 becomes "4h".
 * @param durationMin Duration in minutes
 */
export const getDurationLabel = (
  durationMin: number | null | undefined,
): string => {
  if (durationMin == null || durationMin <= 0) return "Duration";

  const duration = getDurationFromDurationMin(durationMin);

  if (!duration) return "Duration";

  const parts = [
    duration.hours > 0 ? `${duration.hours}h` : null,
    duration.minutes > 0 ? `${duration.minutes}m` : null,
  ];

  return parts.filter((part): part is string => part !== null).join(" ");
};
