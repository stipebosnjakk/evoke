import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { projects, task_completions, tasks } from "@/db/schemas";
import { EntityObjectType } from "@/types/initialState.types";
import { TaskStateData } from "@/types/task.types";
import { toIsoDate } from "@/utils/date";
import { throwDbError } from "@/utils/error";

export const fetchActiveTasksRepo = async (): Promise<
  EntityObjectType<TaskStateData>
> => {
  try {
    const today = toIsoDate(new Date());

    const rows = await db
      .select({
        task: tasks,
        task_completion: task_completions,
        project: {
          id: projects.id,
          name: projects.name,
          color: projects.color,
        },
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.project_id, projects.id))
      .leftJoin(
        task_completions,
        and(
          eq(tasks.id, task_completions.task_id),
          eq(task_completions.completion_date, today),
        ),
      )
      .orderBy(desc(tasks.created_at));

    const data: EntityObjectType<TaskStateData> = {
      ids: [],
      byId: {},
    };

    for (const row of rows) {
      const isRepeating = Boolean(row.task.repeat?.length);

      const task: TaskStateData = {
        ...row.task,
        project: row.project,

        repeat_today_status: isRepeating
          ? row.task_completion
            ? "completed_today"
            : "not_completed_today"
          : null,
      };

      data.ids.push(task.id);
      data.byId[task.id] = task;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get tasks");
  }
};
