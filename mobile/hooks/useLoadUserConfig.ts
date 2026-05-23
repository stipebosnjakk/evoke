import { useEffect } from "react";

import { defaultUserConfig, USER_CONFIG } from "@/constants/config";
import { getItemFor, storeData } from "@/utils/storage";
import { getErrorMessage } from "@/utils/error";
import { useAppDispatch } from "@/hooks/storeHooks";
import { UserConfig } from "@/types/config.types";
import {
  setUserConfig,
  setUserConfigError,
  setUserConfigLoading,
} from "@/store/slices/config.slice";

export const useLoadUserConfig = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadConfig = async () => {
      dispatch(setUserConfigLoading());

      try {
        const storedConfig = await getItemFor(USER_CONFIG);

        if (!storedConfig) {
          await storeData(USER_CONFIG, JSON.stringify(defaultUserConfig));
          dispatch(setUserConfig(defaultUserConfig));
          return;
        }

        dispatch(setUserConfig(JSON.parse(storedConfig) as UserConfig));
      } catch (error) {
        dispatch(setUserConfig(defaultUserConfig));
        dispatch(
          setUserConfigError(
            getErrorMessage(error, "Failed to load user config"),
          ),
        );
      }
    };

    loadConfig();
  }, [dispatch]);
};
