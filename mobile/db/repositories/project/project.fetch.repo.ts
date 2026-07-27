import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { throwDbError } from "@/utils/error";
import { EntityObjectType } from "@/types/initialState.types";
import { ProjectStateData } from "@/types/project.types";
import { list_order, projects } from "@/db/schemas";

export const fetchProjectsRepo = async (): Promise<
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
      .orderBy(desc(projects.created_at), asc(list_order.order_key));

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
