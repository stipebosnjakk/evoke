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
  create: { title: "Create Task", href: "/create-task" },
} as const;

export const TASK_STATUSES = [
  { label: "Next", 
    value: "next", 
    icon: "tag" 
  },
  {
    label: "Someday",
    value: "someday",
    icon: "clock",
  },
  {
    label: "Waiting",
    value: "waiting",
    icon: "hourglass",
  },
] as const;
