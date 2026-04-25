import { TaskStatusOptionsArray } from "@/types/task.types";

export const STATUS_OPTIONS: TaskStatusOptionsArray[] = [
  {
    label: "Next",
    value: "next",
    icon: "tag",
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
