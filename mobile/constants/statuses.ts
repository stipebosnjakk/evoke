import { TaskStatusOptionsArray } from "@/types/task.types";

export const TASK_STATUSES: TaskStatusOptionsArray[] = [
  { 
    label: "Next", 
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
];
