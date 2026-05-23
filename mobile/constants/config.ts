import {
  INBOX_SCOPE_ID,
  UPCOMING_SCOPE_ID,
  PROJECTS_SCOPE_ID,
  TODAY_SCOPE_ID,
  TODAY_SCOPE_COMPLETED_ID,
  TODAY_SCOPE_DUE_TODAY_ID,
  TODAY_SCOPE_OVERDUE_ID,
  TODAY_SCOPE_READY_ID,
  UPCOMING_SCOPE_UPCOMING_ID,
  UPCOMING_SCOPE_WAITING_ID,
  UPCOMING_SCOPE_SOMEDAY_ID,
  PROJECTS_SCOPE_ACTIVE_ID,
  PROJECTS_SCOPE_ARCHIVED_ID,
  PROJECTS_SCOPE_COMPLETED_ID,
} from "@/constants/scopeIds";
import { UserConfig } from "@/types/config.types";

export const USER_CONFIG = process.env.EXPO_PUBLIC_USER_CONFIG ?? "USER_CONFIG";

export const defaultUserConfig: UserConfig = {
  theme: "system",
  screens: {
    [TODAY_SCOPE_ID]: {
      view: "list",
      group_order: [
        {
          id: TODAY_SCOPE_OVERDUE_ID,
          order_key: 4,
          isOpen: true,
        },
        {
          id: TODAY_SCOPE_DUE_TODAY_ID,
          order_key: 3,
          isOpen: true,
        },
        {
          id: TODAY_SCOPE_READY_ID,
          order_key: 2,
          isOpen: true,
        },
        {
          id: TODAY_SCOPE_COMPLETED_ID,
          order_key: 1,
          isOpen: false,
        },
      ],
    },
    [UPCOMING_SCOPE_ID]: {
      view: "group",
      group_order: [
        {
          id: UPCOMING_SCOPE_UPCOMING_ID,
          order_key: 3,
          isOpen: true,
        },
        {
          id: UPCOMING_SCOPE_WAITING_ID,
          order_key: 2,
          isOpen: true,
        },
        {
          id: UPCOMING_SCOPE_SOMEDAY_ID,
          order_key: 1,
          isOpen: true,
        },
      ],
    },
    [PROJECTS_SCOPE_ID]: {
      view: "list",
      group_order: [
        {
          id: PROJECTS_SCOPE_ACTIVE_ID,
          order_key: 3,
          isOpen: true,
        },
        {
          id: PROJECTS_SCOPE_ARCHIVED_ID,
          order_key: 2,
          isOpen: true,
        },
        {
          id: PROJECTS_SCOPE_COMPLETED_ID,
          order_key: 1,
          isOpen: true,
        },
      ],
    },
    [INBOX_SCOPE_ID]: {
      view: null,
      group_order: [],
    },
  },
};
