export const TITLE_BY_ROUTE: Record<string, string> = {
  index: "Today",
  plan: "Plan",
  inbox: "Inbox",
  projects: "Projects",
};

export const routes = {
  today: {
    title: "Today",
    href: "/",
    route: "index",
  },
  plan: {
    title: "Plan",
    href: "/plan",
    route: "plan",
  },
  inbox: {
    title: "Inbox",
    href: "/inbox",
    route: "inbox",
  },
  create_project: {
    title: "Create Project",
    href: "/create/project",
    route: "create/project/index",
  },
  create_task: {
    title: "Create Task",
    href: "/create/task",
    route: "create/task/index",
  },
  create_task_date: {
    title: "Date",
    href: "/create/task/date",
    route: "create/task/date",
  },
  create_task_deadline: {
    title: "Deadline",
    href: "/create/task/deadline",
    route: "create/task/deadline",
  },
  create_task_time: {
    title: "Time",
    href: "/create/task/time",
    route: "create/task/time",
  },
  create_task_repeat: {
    title: "Repeat",
    href: "/create/task/repeat",
    route: "create/task/repeat",
  },
  create_task_status: {
    title: "Status",
    href: "/create/task/status",
    route: "create/task/status",
  },
} as const;

export const createSheetRoutes = [
  routes.create_task,
  routes.create_task_date,
  routes.create_task_deadline,
  routes.create_task_status,
  routes.create_task_repeat,
  routes.create_task_time,
  routes.create_project,
] as const;
