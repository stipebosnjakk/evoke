import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { ProjectsGroupId } from "@/types/scope.types";
import { GroupByIdType, SelectDataReturn } from "@/types/group.types";
import {
  PROJECTS_SCOPE_ACTIVE_ID,
  PROJECTS_SCOPE_ARCHIVED_ID,
  PROJECTS_SCOPE_COMPLETED_ID,
} from "@/constants/scopeIds";
import { ProjectStateData } from "@/types/project.types";

export const selectProjectIds = (state: RootState) =>
  state.projects.projects.ids;
export const selectProjectsById = (state: RootState) =>
  state.projects.projects.byId;

export const selectProjects = createSelector(
  [selectProjectIds, selectProjectsById],
  (ids, byId): SelectDataReturn<ProjectsGroupId> => {
    const groupsById: GroupByIdType<ProjectsGroupId> = {
      [PROJECTS_SCOPE_ACTIVE_ID]: {
        title: "Active",
        data: [],
      },
      [PROJECTS_SCOPE_ARCHIVED_ID]: {
        title: "Archived",
        data: [],
      },
      [PROJECTS_SCOPE_COMPLETED_ID]: {
        title: "Completed",
        data: [],
      },
    };

    ids.forEach((id) => {
      const project = byId[id];

      if (project.archived_at) {
        groupsById[PROJECTS_SCOPE_ARCHIVED_ID].data.push(project);
      } else if (project.completed_at) {
        groupsById[PROJECTS_SCOPE_COMPLETED_ID].data.push(project);
      } else {
        groupsById[PROJECTS_SCOPE_ACTIVE_ID].data.push(project);
      }
    });

    const list: ProjectStateData[] = [];

    Object.values(groupsById).forEach((group) => {
      list.push(...group.data);
    });

    return {
      groupsById,
      list,
      total: ids.length,
    };
  },
);

export const selectProjectById = createSelector(
  [
    selectProjectsById,
    (_state: RootState, projectId?: string | null) => projectId,
  ],
  (byId, projectId): ProjectStateData | undefined => {
    if (!projectId) return undefined;
    return byId[projectId];
  },
);
