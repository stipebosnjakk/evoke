export type ScopeScreenId =
  | "scope:today"
  | "scope:upcoming"
  | "scope:projects"
  | "scope:inbox";

export type TodayGroupId =
  | "scope:today:overdue"
  | "scope:today:due_today"
  | "scope:today:ready";

export type UpcomingGroupId =
  | "scope:upcoming:upcoming"
  | "scope:upcoming:waiting"
  | "scope:upcoming:someday";

export type ProjectsGroupId =
  | "scope:projects:active"
  | "scope:projects:completed";

export type ScopeGroupId = TodayGroupId | UpcomingGroupId | ProjectsGroupId;
