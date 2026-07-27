import { eq, inArray, desc, and } from "drizzle-orm";
import { getUnixTime } from "date-fns";

import { db, list_order, projects, task_completions, tasks } from "@/db";
import { TaskProject, TaskStateData } from "@/types/task.types";
import { throwDbError } from "@/utils/error";
import { ProjectTask } from "@/types/project.types";
import { toIsoDate } from "@/utils/date";

type AssignTasksToProjectReturnType = {
  projectTasks: ProjectTask[];
  project: TaskProject;
};

export const assignTasksToProjectRepo = async (
  taskIds: string[],
  projectId: string,
): Promise<AssignTasksToProjectReturnType> => {
  try {
    const now = getUnixTime(new Date());

    if (!taskIds.length) {
      throw new Error("Task IDs are required");
    }

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    return await db.transaction(async (tx) => {
      const [project] = await tx
        .select({ id: projects.id, name: projects.name, color: projects.color })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!project) {
        throw new Error(`Project "${projectId}" does not exist`);
      }

      const last = await tx
        .select({ order_key: list_order.order_key })
        .from(list_order)
        .where(eq(list_order.scope_id, projectId))
        .orderBy(desc(list_order.order_key))
        .limit(1);

      const maxOrderKey = last[0]?.order_key ?? 0;
      const projectTasks: ProjectTask[] = taskIds.map((taskId, index) => ({
        id: taskId,
        order_key: maxOrderKey + (taskIds.length - index) * 1000,
      }));

      await tx
        .update(tasks)
        .set({
          project_id: projectId,
          updated_at: now,
        })
        .where(inArray(tasks.id, taskIds));

      await tx.insert(list_order).values(
        projectTasks.map((task) => ({
          scope_id: projectId,
          item_id: task.id,
          order_key: task.order_key,
        })),
      );

      return {
        projectTasks,
        project,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to add tasks to project");
  }
};

export type UnassignProjectFromTaskReturnType = {
  task: TaskStateData;
  projectId: string;
};

export const unassignTaskFromProjectRepo = async (
  taskId: string,
): Promise<UnassignProjectFromTaskReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const [existingTask] = await tx
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!existingTask) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      if (!existingTask.project_id) {
        throw new Error(`Task "${taskId}" is not assigned to a project`);
      }

      const projectId = existingTask.project_id;
      const now = getUnixTime(new Date());

      await tx
        .delete(list_order)
        .where(
          and(
            eq(list_order.scope_id, projectId),
            eq(list_order.item_id, taskId),
          ),
        );

      const [updatedTask] = await tx
        .update(tasks)
        .set({
          project_id: null,
          updated_at: now,
        })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        throw new Error(`Failed to remove project from task "${taskId}"`);
      }

      const today = toIsoDate(new Date());

      const [completion] = await tx
        .select({ id: task_completions.id })
        .from(task_completions)
        .where(
          and(
            eq(task_completions.task_id, taskId),
            eq(task_completions.completion_date, today),
          ),
        )
        .limit(1);

      return {
        projectId,
        task: {
          ...updatedTask,
          project: null,
          repeat_today_status: updatedTask.repeat?.length
            ? completion
              ? "completed_today"
              : "not_completed_today"
            : null,
        },
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to remove project from task");
  }
};
