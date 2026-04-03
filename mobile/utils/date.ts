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
} from "date-fns";
import { enUS } from "date-fns/locale";

import { IsoDate } from "@/types/task.types";
import { weekdays } from "@/constants/date";

// TODO: remove this if you don't need it

// TODO: write params for utils

const userLocale = Localization.getLocales()?.[0]?.languageTag ?? "en-US";
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

  if (!input) return null;
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
