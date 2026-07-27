import { and, eq, ne } from "drizzle-orm";
import { getUnixTime } from "date-fns";

import { db } from "@/db/client";
import { throwDbError } from "@/utils/error";
import { Project, projects, Task, tasks } from "@/db/schemas";

export type CompleteProjectReturnType = {
  project: Project;
  tasks: Task[];
};

export const completeProjectRepo = async (
  projectId: string,
): Promise<CompleteProjectReturnType> => {
  if (!projectId.trim()) {
    throw new Error("Project ID is required");
  }

  try {
    return await db.transaction(async (tx) => {
      const now = getUnixTime(new Date());

      const [completedProject] = await tx
        .update(projects)
        .set({
          status: "completed",
          completed_at: now,
          updated_at: now,
        })
        .where(
          and(eq(projects.id, projectId), ne(projects.status, "completed")),
        )
        .returning();

      if (!completedProject) {
        const [existingProject] = await tx
          .select({
            id: projects.id,
            status: projects.status,
          })
          .from(projects)
          .where(eq(projects.id, projectId))
          .limit(1);

        if (!existingProject) {
          throw new Error(`Project "${projectId}" does not exist`);
        }

        throw new Error(
          `Project "${projectId}" cannot be completed from status "${existingProject.status}"`,
        );
      }

      const completedTasks = await tx
        .update(tasks)
        .set({
          is_completed: true,
          completed_at_utc: now,
          updated_at: now,
        })
        .where(
          and(eq(tasks.project_id, projectId), eq(tasks.is_completed, false)),
        )
        .returning();

      return {
        project: completedProject,
        tasks: completedTasks,
      };
    });
  } catch (error) {
    throwDbError(error, `Failed to complete project "${projectId}"`);
  }
};
