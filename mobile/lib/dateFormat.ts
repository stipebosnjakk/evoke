import * as Localization from "expo-localization";

const userLocale = Localization.getLocales()?.[0]?.languageTag ?? "en-US";
console.log("User locale:", userLocale);

export const createdAtFormat=(ms:number)=>
  new Date(ms).toLocaleDateString(userLocale,{month:"short",day:"numeric"});
