import { GroupConfig } from "@/types/group.types";
import { ScopeScreenId } from "@/types/scope.types";

export type UserConfig = {
  theme: UserTheme;
  screens: Record<ScopeScreenId, ScreenConfig>;
};

export type ScreenConfig = {
  view: ViewType;
  group_order: GroupConfig[];
};

export type UserTheme = "light" | "dark" | "system";

export type ViewType = "group" | "list" | "inbox" | "completed";
