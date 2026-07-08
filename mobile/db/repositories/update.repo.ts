import { eq, and, inArray, desc, isNotNull } from "drizzle-orm";

import { db, list_order, Project, projects, Task, tasks } from "@/db";
import { OrderTaskItem, TaskProject, TaskStateData } from "@/types/task.types";
import { throwDbError } from "@/utils/error";
import { getUnixTime } from "date-fns";
import { ProjectTask } from "@/types/project.types";

export const restoreCompletedTaskRepo = async (
  taskId: string,
): Promise<TaskStateData> => {
  try {
    const now = getUnixTime(new Date());

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        is_completed: false,
        completed_at_utc: null,
        updated_at: now,
      })
      .where(eq(tasks.id, taskId))
      .returning({ id: tasks.id });

    if (!updatedTask) {
      throw new Error(`Failed to restore task "${taskId}"`);
    }

    const [row] = await db
      .select({
        task: tasks,
        project: {
          id: projects.id,
          name: projects.name,
          color: projects.color,
        },
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.project_id, projects.id))
      .where(eq(tasks.id, updatedTask.id))
      .limit(1);

    if (!row) {
      throw new Error(`Failed to fetch restored task "${taskId}"`);
    }

    return {
      ...row.task,
      project: row.project,
    };
  } catch (error) {
    return throwDbError(error, "Failed to restore task");
  }
};

export const completeTaskRepo = async (
  taskId: string,
): Promise<TaskStateData> => {
  try {
    const now = getUnixTime(new Date());

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        is_completed: true,
        completed_at_utc: now,
        updated_at: now,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask) {
      throw new Error(`Failed to complete task "${taskId}""`);
    }

    const [row] = await db
      .select({
        task: tasks,
        project: {
          id: projects.id,
          name: projects.name,
          color: projects.color,
        },
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.project_id, projects.id))
      .where(eq(tasks.id, updatedTask.id))
      .limit(1);

    if (!row) {
      throw new Error(`Failed to fetch restored task "${taskId}"`);
    }

    return {
      ...row.task,
      project: row.project,
    };
  } catch (error) {
    return throwDbError(error, "Failed to complete task");
  }
};

export const updateOrderKeysRepo = async (
  orderArray: OrderTaskItem[],
  scopeId: string,
) => {
  try {
    if (!scopeId) {
      throw new Error("Scope ID is required");
    }

    if (!orderArray.length) {
      throw new Error("Order array is required");
    }

    for (const { id, order_key } of orderArray) {
      if (!id) {
        throw new Error("Task ID is required");
      }
      if (!Number.isFinite(order_key)) {
        throw new Error(`Order key ${order_key} must be a valid number`);
      }
    }

    await db.transaction(async (tx) => {
      for (const { id, order_key } of orderArray) {
        await tx
          .update(list_order)
          .set({ order_key })
          .where(
            and(eq(list_order.item_id, id), eq(list_order.scope_id, scopeId)),
          );
      }
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to update order keys");
  }
};

type AddTasksToProjectReturnType = {
  projectTasks: ProjectTask[];
  project: TaskProject;
};

export const addTasksToProjectRepo = async (
  taskIds: string[],
  projectId: string,
): Promise<AddTasksToProjectReturnType> => {
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

export type UpdateProjectInput = {
  id: string;
  name?: string;
  color?: string;
};

export type UpdateProjectReturnType = {
  project: {
    id: string;
    name: string;
    color: string;
  };
};

export const updateProjectRepo = async (
  project: UpdateProjectInput,
): Promise<UpdateProjectReturnType> => {
  try {
    const now = getUnixTime(new Date());

    if (!project) {
      throw new Error("Project data is required");
    }

    if (!project.id) {
      throw new Error("Project ID is required");
    }

    if (project.name === undefined && project.color === undefined) {
      throw new Error("No project fields provided");
    }

    return await db.transaction(async (tx) => {
      const [existingProject] = await tx
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, project.id))
        .limit(1);

      if (!existingProject) {
        throw new Error(`Project "${project.id}" does not exist`);
      }

      await tx
        .update(projects)
        .set({
          updated_at: now,
          name: project.name,
          color: project.color,
        })
        .where(eq(projects.id, project.id));

      const [updatedProject] = await tx
        .select({
          id: projects.id,
          name: projects.name,
          color: projects.color,
        })
        .from(projects)
        .where(eq(projects.id, project.id))
        .limit(1);

      if (!updatedProject) {
        throw new Error(`Failed to fetch updated project "${project.id}"`);
      }

      return {
        project: updatedProject,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update project");
  }
};

export type CompleteProjectReturnType = {
  project: Project;
};

export const completeProjectRepo = async (
  projectId: string | null,
): Promise<CompleteProjectReturnType> => {
  try {
    const now = getUnixTime(new Date());

    if (!projectId) {
      throw new Error("Project data is required");
    }

    return await db.transaction(async (tx) => {
      const [existingProject] = await tx
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!existingProject) {
        throw new Error(`Project "${projectId}" does not exist`);
      }

      if (existingProject.status !== "completed") {
        await tx
          .update(projects)
          .set({
            status: "completed",
            completed_at: now,
            archived_at: null,
            updated_at: now,
          })
          .where(eq(projects.id, projectId));
      }

      const [completedProject] = await tx
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!completedProject) {
        throw new Error(`Failed to fetch completed project "${projectId}"`);
      }

      return {
        project: completedProject,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to complete project");
  }
};

export type CompleteProjectTasksType = {
  tasks: Task[];
};

export const completeProjectTasksRepo = async (
  projectId: string | null,
  taskIds: string[] = [],
): Promise<CompleteProjectTasksType> => {
  try {
    const now = getUnixTime(new Date());
    const uniqueTaskIds = [...new Set(taskIds)];

    if (!projectId) {
      throw new Error("Project data is required");
    }

    return db.transaction(async (tx) => {
      const [updatedProject] = await tx
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, projectId),
            eq(projects.status, "completed"),
            isNotNull(projects.completed_at),
          ),
        )
        .limit(1);

      if (!updatedProject) {
        throw new Error(`Project "${projectId}" does not exist`);
      }

      const projectTasks = await tx
        .select({ id: tasks.id })
        .from(tasks)
        .where(
          and(
            inArray(tasks.id, uniqueTaskIds),
            eq(tasks.project_id, projectId),
            eq(tasks.is_deleted, false),
          ),
        );

      if (uniqueTaskIds.length === 0) {
        return {
          tasks: [],
        };
      }

      const projectTaskIds = new Set(projectTasks.map((task) => task.id));
      const invalidTaskIds = uniqueTaskIds.filter(
        (taskId) => !projectTaskIds.has(taskId),
      );

      if (invalidTaskIds.length > 0) {
        throw new Error(`Some tasks do not belong to project "${projectId}"`);
      }

      const updatedTasks = await tx
        .update(tasks)
        .set({
          is_completed: true,
          completed_at_utc: now,
          updated_at: now,
        })
        .where(
          and(
            inArray(tasks.id, uniqueTaskIds),
            eq(tasks.project_id, projectId),
            eq(tasks.is_deleted, false),
            eq(tasks.is_completed, false),
          ),
        )
        .returning();

      return {
        tasks: updatedTasks,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update project tasks");
  }
};
