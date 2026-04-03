export const TITLE_BY_ROUTE: Record<string, string> = {
  index: "Today",
  plan: "Plan",
  inbox: "Inbox",
  projects: "Projects",
};

export const routes = {
  today: { title: "Today", href: "/(tabs)" },
  plan: { title: "Plan", href: "/(tabs)/plan" },
  inbox: { title: "Inbox", href: "/(tabs)/inbox" },
  projects: { title: "Projects", href: "/(tabs)/projects" },
  create: { title: "Create Task", href: "/(modals)/create/task/create" },
  date: { title: "Date", href: "/(modals)/create/task/date" },
  deadline: { title: "Deadline", href: "/(modals)/create/task/deadline" },
} as const;
