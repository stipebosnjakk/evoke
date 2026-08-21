import { eq, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getUnixTime } from "date-fns";

import {
  db,
  list_order,
  FormProject,
  projects,
  tasks,
  Project,
  Task,
} from "@/db";
import { throwDbError } from "@/utils/error";
import { PROJECTS_SCOPE_ID } from "@/constants/scopeIds";
import { ProjectStatus, ProjectWithOrderKey } from "@/types/project.types";

export const createProjectRepo = async (
  project: FormProject,
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
        project: { ...createdProject, tasks: [] },
        order_key: newOrderKey,
      };
    });
  } catch (error) {
    console.error(error)
    return throwDbError(error, "Failed to create a project");
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

export type DeleteProjectReturnType = {
  project: Project;
  tasks: Task[];
};

export const deleteProjectRepo = async (
  projectId: string | null,
): Promise<DeleteProjectReturnType> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
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

      const deletedTasks = await tx
        .delete(tasks)
        .where(eq(tasks.project_id, projectId))
        .returning();

      const [deletedProject] = await tx
        .delete(projects)
        .where(eq(projects.id, projectId))
        .returning();

      if (!deletedProject) {
        throw new Error(`Failed to delete project "${projectId}"`);
      }

      return {
        project: deletedProject,
        tasks: deletedTasks,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to delete project");
  }
};
