import { Project } from "@/db";

export type ProjectStatus = "active" | "completed" | "archived";

export type ProjectWithOrderKey = {
  project: Project;
  order_key: number | null;
};

export type ProjectColor = {
  name: string;
  hex: string;
};
