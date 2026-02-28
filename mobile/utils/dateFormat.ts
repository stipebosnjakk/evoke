import * as Localization from "expo-localization";

const userLocale = Localization.getLocales()?.[0]?.languageTag ?? "en-US";

export const createdAtFormat = (ms: number) =>
  new Date(ms).toLocaleDateString(userLocale, {
    month: "short",
    day: "numeric",
  });
