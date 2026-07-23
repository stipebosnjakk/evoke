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
    href: "/projects",
    route: "projects",
  },
  form_project: {
    title: "Project",
    href: "/form/project",
    route: "form/project/index",
  },
  form_project_color: {
    title: "Project Color",
    href: "/form/project/color",
    route: "form/project/color",
  },
  form_task: {
    title: "Task",
    href: "/form/task",
    route: "form/task/index",
  },
  form_task_date: {
    title: "Date",
    href: "/form/task/date",
    route: "form/task/date",
  },
  form_task_deadline: {
    title: "Deadline",
    href: "/form/task/deadline",
    route: "form/task/deadline",
  },
  form_task_time: {
    title: "Time",
    href: "/form/task/time",
    route: "form/task/time",
  },
  form_task_repeat: {
    title: "Repeat",
    href: "/form/task/repeat",
    route: "form/task/repeat",
  },
  form_task_status: {
    title: "Status",
    href: "/form/task/status",
    route: "form/task/status",
  },
  form_task_project: {
    title: "Select project",
    href: "/form/task/project",
    route: "form/task/project",
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
  add_tasks_to_project: {
    title: "Add",
    href: "/project/add/[projectId]",
    route: "project/add/[projectId]",
  },
} as const;

export const createSheetRoutes = [
  routes.form_task,
  routes.form_task_date,
  routes.form_task_deadline,
  routes.form_task_status,
  routes.form_task_repeat,
  routes.form_task_time,
  routes.form_project,
  routes.form_project_color,
] as const;
