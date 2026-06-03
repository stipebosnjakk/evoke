import { eq, desc } from "drizzle-orm";

import { db, list_order, Project, projects, tasks } from "@/db";
import { throwDbError } from "@/utils/error";
import { EntityObjectType, OrderObject } from "@/types/initialState.types";
import { TaskStateData } from "@/types/task.types";

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

export const fetchProjects = async (): Promise<EntityObjectType<Project>> => {
  try {
    const rows = await db.select().from(projects);

    const data: EntityObjectType<Project> = {
      ids: [],
      byId: {},
    };

    for (const row of rows) {
      data.ids.push(row.id);
      data.byId[row.id] = row;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get projects");
  }
};
