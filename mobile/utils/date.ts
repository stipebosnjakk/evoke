import * as Localization from "expo-localization";

const userLocale = Localization.getLocales()?.[0]?.languageTag ?? "en-US";

export const createdAtFormat = (ms: number) =>
  new Date(ms).toLocaleDateString(userLocale, {
    month: "short",
    day: "numeric",
  });

export const isValidIsoDate = (value: string): boolean => {
  const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  if (!ISO_DATE_REGEX.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const getTodayIsoDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
