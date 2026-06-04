import { Project } from "@/db";

export type ProjectStatus = "active" | "completed" | "archived";

export type ProjectWithOrderKey = {
  project: ProjectStateData;
  order_key: number | null;
};

export type ProjectColor = {
  name: string;
  hex: string;
};

export type ProjectTask = {
  id: string;
  order_key: number;
};

export type ProjectStateData = Project & {
  tasks: ProjectTask[];
};
