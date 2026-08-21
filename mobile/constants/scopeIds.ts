import { ViewType } from "@/types/config.types";

export const INBOX_SCOPE_ID = "scope:inbox";
export const INBOX_SCOPE_ACTIVE_ID = "scope:inbox:active";
export const INBOX_SCOPE_COMPLETED_ID = "scope:inbox:completed";

export const TODAY_SCOPE_ID = "scope:today";
export const TODAY_SCOPE_OVERDUE_ID = "scope:today:overdue";
export const TODAY_SCOPE_DUE_TODAY_ID = "scope:today:due_today";
export const TODAY_SCOPE_READY_ID = "scope:today:ready";

export const UPCOMING_SCOPE_ID = "scope:upcoming";
export const UPCOMING_SCOPE_UPCOMING_ID = "scope:upcoming:upcoming";
export const UPCOMING_SCOPE_WAITING_ID = "scope:upcoming:waiting";
export const UPCOMING_SCOPE_SOMEDAY_ID = "scope:upcoming:someday";

export const PROJECTS_SCOPE_ID = "scope:projects";
export const PROJECTS_SCOPE_ACTIVE_ID = "scope:projects:active";
export const PROJECTS_SCOPE_COMPLETED_ID = "scope:projects:completed";

type ViewOption = {
  view: ViewType;
  nextView: ViewType;
  icon: string;
};

export const VIEW_OPTIONS: Record<ViewType, ViewOption> = {
  group: {
    view: "group",
    nextView: "list",
    icon: "rectangle.stack.fill",
  },
  list: {
    view: "list",
    nextView: "group",
    icon: "rectangle.grid.1x2.fill",
  },
  inbox: {
    view: "inbox",
    nextView: "completed",
    icon: "rectangle.grid.1x2.fill",
  },
  completed: {
    view: "completed",
    nextView: "inbox",
    icon: "checkmark.circle.fill",
  },
};
