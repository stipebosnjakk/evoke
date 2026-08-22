import AsyncStorage from "@react-native-async-storage/async-storage";

import { getErrorMessage } from "./error";

/**
 * Stores a string value in AsyncStorage under the provided key
 * @param key
 * @param value
 */
export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    getErrorMessage(error, "Failed to store storage data");
  }
};

/**
 * Retrieves a string value from AsyncStorage by key, or returns null if missing or failed
 * @param key
 * @returns
 */
export const getItemFor = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    getErrorMessage(error, "Failed to get storage data");
  }
};
