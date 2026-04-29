import { weekdays } from "@/constants/date";
import { addDays, isValid, nextDay, parse, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";

/**
 * Parse a string into a Date
 *
 * @param value The text you want to parse, example: "12/5/2026", "26 Apr", "26 April 2026"
 * @param referenceDate A date used by date-fns when the input is missing some parts, example: "26 Apr"
 * @param patterns A list of allowed formats.
 * @returns
 */
const parseFromPatterns = (
  value: string,
  referenceDate: Date,
  patterns: { regex: RegExp; format: string; useLocale?: boolean }[],
): Date | null => {
  // Loop through every possible format
  for (const pattern of patterns) {
    // Check if the input matches the regex
    if (!pattern.regex.test(value)) continue;
    // Convert the text into Date
    const date = parse(
      value,
      pattern.format,
      referenceDate,
      pattern.useLocale ? { locale: enUS } : undefined,
    );
    // If date is valid, return it at the start of the day
    if (isValid(date)) return startOfDay(date);
  }
  return null;
};

/**
 *  It takes whatever the user typed and tries to convert it to a date
 *
 * @param raw The input text to parse into a Date, example: "today", "tomorrow", "next Sunday", "Sunday", "12/5/2026", "26 Apr", "26 April 2026"
 * @returns
 */
export const smartDateInput = (raw: string): Date | null => {
  const now = new Date();
  const today = startOfDay(now);
  // Clean whitespace
  const normalizedText = raw.trim().replace(/\s+/g, " ");
  const input = normalizedText.toLowerCase();

  if (!input) return null;
  if (input === "today") return today;
  if (input === "tomorrow") return addDays(today, 1);

  // Must start with "next " followed by a weekday
  const nextMatch = input.match(
    /^next (sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/,
  );

  // Get the weekday number & return the date of the next weekday
  if (nextMatch) {
    const day = weekdays[nextMatch[1] as keyof typeof weekdays];
    return startOfDay(nextDay(today, day));
  }

  // Handle plain weekday names
  if (input in weekdays) {
    return startOfDay(nextDay(today, weekdays[input as keyof typeof weekdays]));
  }

  // It normalizes separators to /
  const numericInput = input.replace(/[.-]/g, "/");

  // Two numeric formats are supported: yyyy/M/d and d/M/yyyy
  const numericDate = parseFromPatterns(numericInput, today, [
    { regex: /^\d{4}\/\d{1,2}\/\d{1,2}$/, format: "yyyy/M/d" },
    { regex: /^\d{1,2}\/\d{1,2}\/\d{4}$/, format: "d/M/yyyy" },
  ]);

  if (numericDate) {
    if (startOfDay(numericDate) < today) return null;
    return numericDate;
  }

  // Capitalizes words, example: "26 april" > "26 April"
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
