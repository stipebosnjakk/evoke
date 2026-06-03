import { eq, desc, and } from "drizzle-orm";

import { db, list_order, projects, tasks } from "@/db";
import { throwDbError } from "@/utils/error";
import { EntityObjectType, OrderObject } from "@/types/initialState.types";
import { TaskStateData } from "@/types/task.types";
import { ProjectStateData } from "@/types/project.types";

export const fetchActiveTasks = async (): Promise<
  EntityObjectType<TaskStateData>
> => {
  try {
    const rows = await db
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
      .where(eq(tasks.is_deleted, false));

    const data: EntityObjectType<TaskStateData> = {
      ids: [],
      byId: {},
    };

    for (const row of rows) {
      const task: TaskStateData = {
        ...row.task,
        project: row.project,
      };

      data.ids.push(task.id);
      data.byId[task.id] = task;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get tasks");
  }
};

export const fetchScopeOrder = async (
  scopeId: string,
): Promise<OrderObject> => {
  try {
    if (!scopeId) {
      throw Error("Scope ID is required");
    }

    const rows = await db
      .select({
        task_id: list_order.item_id,
        order_key: list_order.order_key,
      })
      .from(list_order)
      .where(eq(list_order.scope_id, scopeId))
      .orderBy(desc(list_order.order_key));

    const data: OrderObject = {};

    for (const row of rows) {
      data[row.task_id] = row.order_key;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get order keys");
  }
};

export const fetchProjects = async (): Promise<
  EntityObjectType<ProjectStateData>
> => {
  try {
    const rows = await db
      .select({
        project: projects,
        task: {
          id: list_order.item_id,
          order_key: list_order.order_key,
        },
      })
      .from(projects)
      .leftJoin(list_order, eq(projects.id, list_order.scope_id))
      .orderBy(projects.created_at, list_order.order_key);

    const data: EntityObjectType<ProjectStateData> = {
      ids: [],
      byId: {},
    };

    for (const row of rows) {
      const projectId = row.project.id;

      if (!data.byId[projectId]) {
        data.ids.push(projectId);

        data.byId[projectId] = {
          ...row.project,
          tasks: [],
        };
      }

      if (row.task) {
        data.byId[projectId].tasks.push(row.task);
      }
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get projects");
  }
};
