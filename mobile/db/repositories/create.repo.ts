import { eq, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db, list_order, NewProject, NewTask, projects, tasks } from "@/db";
import { throwDbError } from "@/utils/error";
import { INBOX_SCOPE_ID, PROJECTS_SCOPE_ID } from "@/constants/scopeIds";
import { isInboxTask } from "@/utils/taskPlacement";
import { TaskStatus, TaskWithOrderKey } from "@/types/task.types";
import { ProjectStatus, ProjectWithOrderKey } from "@/types/project.types";

// TODO: for some reason all of my tasks has order key around 5000

export const createTaskRepo = async (
  task: NewTask,
): Promise<TaskWithOrderKey> => {
  try {
    return await db.transaction(async (tx) => {
      if (!task.title) {
        throw new Error("Title is required");
      }

      const taskStatus: TaskStatus | null = !task.status
        ? task.start_date || task.deadline
          ? "next"
          : null
        : task.status;

      const normalizedTask = {
        ...task,
        status: taskStatus,
      };

      const id = createId();
      const isInbox = isInboxTask(normalizedTask);
      let newOrderKey: number | null = null;

      if (isInbox) {
        const last = await tx
          .select()
          .from(list_order)
          .where(eq(list_order.scope_id, INBOX_SCOPE_ID))
          .orderBy(desc(list_order.order_key))
          .limit(1);

        const maxOrderKey = last[0]?.order_key ?? 0;
        newOrderKey = maxOrderKey + 1000 || 1000;

        await tx.insert(list_order).values({
          scope_id: INBOX_SCOPE_ID,
          item_id: id,
          order_key: newOrderKey,
        });
      }

      await tx.insert(tasks).values({
        ...normalizedTask,
        id,
      });

      const [createdTask] = await tx
        .select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .limit(1);

      if (!createdTask) {
        throw new Error("Failed to create task");
      }

      return {
        task: createdTask,
        order_key: newOrderKey,
      };
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to create task");
  }
};

export const createProjectRepo = async (
  project: NewProject,
): Promise<ProjectWithOrderKey> => {
  try {
    return await db.transaction(async (tx) => {
      if (!project.name?.trim()) {
        throw new Error("Name is required");
      }

      if (!project.color) {
        throw new Error("Color is required");
      }

      const id = createId();
      const status: ProjectStatus = "active";

      const last = await tx
        .select()
        .from(list_order)
        .where(eq(list_order.scope_id, PROJECTS_SCOPE_ID))
        .orderBy(desc(list_order.order_key))
        .limit(1);

      const maxOrderKey = last[0]?.order_key ?? 0;
      const newOrderKey = maxOrderKey + 1000 || 1000;

      await tx.insert(list_order).values({
        scope_id: PROJECTS_SCOPE_ID,
        item_id: id,
        order_key: newOrderKey,
      });

      await tx.insert(projects).values({
        id,
        name: project.name.trim(),
        color: project.color,
        status,
      });

      const [createdProject] = await tx
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      if (!createdProject) {
        throw new Error("Failed to create a project");
      }

      return {
        project: createdProject,
        order_key: newOrderKey,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to create  a project");
  }
};
