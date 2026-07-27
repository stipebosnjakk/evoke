import { eq, desc, sql, and } from "drizzle-orm";

import { toIsoDate } from "@/utils/date";
import { throwDbError } from "@/utils/error";
import { TaskStateData } from "@/types/task.types";
import { db, projects, task_completions, tasks } from "@/db";

export type SearchResults = {
  tasks: TaskStateData[];
  projects: {
    id: string;
    name: string;
    color: string;
  }[];
};

export const searchTasksAndProjectsRepo = async (
  searchQuery: string,
): Promise<SearchResults> => {
  try {
    const search = searchQuery.trim();

    if (!search) {
      return {
        tasks: [],
        projects: [],
      };
    }

    const today = toIsoDate(new Date());

    const [taskRows, projectRows] = await Promise.all([
      db
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
        .where(
          sql<boolean>`
              instr(lower(${tasks.title}), lower(${search})) > 0
            `,
        )
        .orderBy(desc(tasks.created_at)),

      db
        .select({
          id: projects.id,
          name: projects.name,
          color: projects.color,
        })
        .from(projects)
        .where(
          sql<boolean>`
            instr(lower(${projects.name}), lower(${search})) > 0
          `,
        )
        .orderBy(desc(projects.created_at)),
    ]);

    const taskResults: TaskStateData[] = taskRows.map(
      ({ task, project, task_completion }) => {
        const isRepeating = Boolean(task.repeat?.length);

        return {
          ...task,
          project,
          repeat_today_status: isRepeating
            ? task_completion
              ? "completed_today"
              : "not_completed_today"
            : null,
        };
      },
    );

    return {
      tasks: taskResults,
      projects: projectRows,
    };
  } catch (error) {
    return throwDbError(error, "Failed to search tasks and projects");
  }
};
