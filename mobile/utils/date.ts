import * as Localization from "expo-localization";
import {
  format,
  isMatch,
  isValid,
  isThisWeek,
  isToday,
  isTomorrow,
  parseISO,
  parse,
  addDays,
  nextDay,
  startOfDay,
  startOfToday,
  isYesterday,
  isBefore,
  isSameYear,
  addWeeks,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";

import { IsoDate, Weekday } from "@/types/task.types";
import { weekdays } from "@/constants/date";

// TODO: write params for utils

const userLocale = Localization.getLocales()?.[0]?.languageTag ?? "en-US";
const is24h = Localization.getCalendars()?.[0]?.uses24hourClock ?? false;

export const formatUserTime = (date: IsoDate) => {
  return new Intl.DateTimeFormat(userLocale, {
    timeStyle: "short",
    hour12: !is24h,
  }).format(new Date(date));
};

export const formatUserDate = (date: IsoDate) => {
  return new Intl.DateTimeFormat(userLocale, {
    dateStyle: "medium",
  }).format(new Date(date));
};

export const formatUserDateTime = (date: IsoDate) => {
  return new Intl.DateTimeFormat(userLocale, {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: !is24h,
  }).format(new Date(date));
};

export const getWeekendSaturday = (date: IsoDate, weeksAhead = 0) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return addDays(addWeeks(weekStart, weeksAhead), 5);
};

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

export const isValidIsoDate = (value: string) => {
  return isMatch(value, "yyyy-MM-dd") && isValid(parseISO(value));
};

export const formatIsoDate = (date: IsoDate): string => {
  const parsedDate = parseISO(date);
  const isCurrentYear = parsedDate.getFullYear() === new Date().getFullYear();

  return format(parsedDate, isCurrentYear ? "d MMM" : "d MMM yyyy");
};

export const toIsoDate = (date: Date): IsoDate => {
  return format(date, "yyyy-MM-dd") as IsoDate;
};

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

export const formatSmartUiDate = (value: Date) => {
  const date = typeof value === "string" ? parseISO(value) : value;

  return format(
    date,
    isSameYear(date, new Date()) ? "EEEE d MMM" : "EEEE d MMM yyyy",
  );
};

const parseFromPatterns = (
  value: string,
  referenceDate: Date,
  patterns: readonly { regex: RegExp; format: string; useLocale?: boolean }[],
): Date | null => {
  for (const pattern of patterns) {
    if (!pattern.regex.test(value)) continue;
    const date = parse(
      value,
      pattern.format,
      referenceDate,
      pattern.useLocale ? { locale: enUS } : undefined,
    );
    if (isValid(date)) return startOfDay(date);
  }
  return null;
};

export const smartDateInput = (raw: string): Date | null => {
  const now = new Date();
  const today = startOfDay(now);
  const normalizedText = raw.trim().replace(/\s+/g, " ");
  const input = normalizedText.toLowerCase();

  if (!input) {
  }
  if (input === "today") return today;
  if (input === "tomorrow") return addDays(today, 1);

  const nextMatch = input.match(
    /^next (sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/,
  );

  if (nextMatch) {
    const day = weekdays[nextMatch[1] as keyof typeof weekdays];
    return startOfDay(nextDay(today, day));
  }

  if (input in weekdays) {
    return startOfDay(nextDay(today, weekdays[input as keyof typeof weekdays]));
  }

  const numericInput = input.replace(/[.-]/g, "/");

  const numericDate = parseFromPatterns(numericInput, today, [
    { regex: /^\d{4}\/\d{1,2}\/\d{1,2}$/, format: "yyyy/M/d" },
    { regex: /^\d{1,2}\/\d{1,2}\/\d{4}$/, format: "d/M/yyyy" },
  ]);

  if (numericDate) {
    if (startOfDay(numericDate) < today) return null;
    return numericDate;
  }

  const textInput = normalizedText.replace(
    /[a-zA-Z]+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

  const namedMonthDate = parseFromPatterns(textInput, today, [
    { regex: /^\d{1,2}\s+[A-Za-z]{3}$/, format: "d MMM", useLocale: true },
    {
      regex: /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/,
      format: "d MMM yyyy",
      useLocale: true,
    },
    { regex: /^\d{1,2}\s+[A-Za-z]+$/, format: "d MMMM", useLocale: true },
    {
      regex: /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/,
      format: "d MMMM yyyy",
      useLocale: true,
    },
  ]);

  if (namedMonthDate) {
    if (startOfDay(namedMonthDate) < today) return null;
    return namedMonthDate;
  }

  return null;
};

export const getStartTimeMin = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes();
};

export const getDurationMin = (
  durationHours: number,
  durationMinutes: number,
) => {
  if (durationHours === 0 && durationMinutes === 0) {
    return null;
  }

  return durationHours * 60 + durationMinutes;
};

export const getEndTime = (start_time_min: number, duration_min: number) => {
  const total = start_time_min + duration_min;
  return {
    endDayOffset: Math.floor(total / 1440),
    endTimeMin: total % 1440,
  };
};

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

export const getDurationFromDurationMin = (durationMin: number | null) => {
  if (durationMin === null) return null;

  return {
    totalMinutes: durationMin,
    hours: Math.floor(durationMin / 60),
    minutes: durationMin % 60,
  };
};

export const getIsoWeekday = (date: Date) => {
  const weekday = date.getDay();
  return weekday === 0 ? 7 : weekday;
};

const repeatWeekStart = new Date(2024, 0, 1);

export const formatRepeatWeekday = (day: Weekday) => {
  return format(addDays(repeatWeekStart, day), "EEE", { locale: enUS });
};

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
