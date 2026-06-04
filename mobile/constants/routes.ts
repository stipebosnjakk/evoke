export const TITLE_BY_ROUTE: Record<string, string> = {
  index: "Today",
  upcoming: "Upcoming",
  inbox: "Inbox",
  projects: "Projects",
};

export const routes = {
  today: {
    title: "Today",
    href: "/",
    route: "index",
  },
  upcoming: {
    title: "Upcoming",
    href: "/upcoming",
    route: "upcoming",
  },
  inbox: {
    title: "Inbox",
    href: "/inbox",
    route: "inbox",
  },
  projects: {
    title: "Projects",
    href: "/project",
    route: "projects",
  },
  create_project: {
    title: "Create Project",
    href: "/create/project",
    route: "create/project/index",
  },
  create_project_color: {
    title: "Project Color",
    href: "/create/project/color",
    route: "create/project/color",
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
  single_group: {
    title: "Group",
    href: "/group/[groupId]",
    route: "group/[groupId]",
  },
  single_project: {
    title: "Project",
    href: "/project/[projectId]",
    route: "project/[projectId]",
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
  routes.create_project_color,
] as const;
