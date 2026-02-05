import { Task } from "@/db/schema/index";

export type TaskUI = Task & {
  projectName?: string;
  isOverdue: boolean;
};
