import { createSelector } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";

import { Task } from "@/db";
import { RootState } from "@/store/store";
import { toIsoDate } from "@/utils/date";
import { selectProjects } from "@/store/selectors/projects.selector";
import {
  ProjectsGroupId,
  ScopeGroupId,
  TodayGroupId,
  UpcomingGroupId,
} from "@/types/scope.types";
import {
  isCompletedTodayTask,
  isInboxTask,
  isTodayTask,
  isUpcomingTask,
} from "@/utils/taskPlacement";
import {
  GroupByIdType,
  GroupData,
  SelectDataReturn,
} from "@/types/group.types";
import {
  TODAY_SCOPE_COMPLETED_ID,
  TODAY_SCOPE_DUE_TODAY_ID,
  TODAY_SCOPE_OVERDUE_ID,
  TODAY_SCOPE_READY_ID,
  UPCOMING_SCOPE_SOMEDAY_ID,
  UPCOMING_SCOPE_UPCOMING_ID,
  UPCOMING_SCOPE_WAITING_ID,
} from "@/constants/scopeIds";
import { OrderObject } from "@/types/initialState.types";
import { TaskStateData, TaskWithOrderKey } from "@/types/task.types";

export const selectTaskIds = (state: RootState) => state.tasks.tasks.ids;
export const selectTasksById = (state: RootState) => state.tasks.tasks.byId;
export const selectInboxOrder = (state: RootState) =>
  state.tasks.taskOrder.inbox;

export const selectTodayTasks = createSelector(
  [selectTaskIds, selectTasksById],
  (
    ids: string[],
    byId: Record<string, TaskStateData>,
  ): SelectDataReturn<TodayGroupId> => {
    const today = toIsoDate(startOfToday());

    const groupsById: GroupByIdType<TodayGroupId> = {
      [TODAY_SCOPE_OVERDUE_ID]: {
        title: "Overdue",
        data: [],
      },
      [TODAY_SCOPE_DUE_TODAY_ID]: {
        title: "Due Today",
        data: [],
      },
      [TODAY_SCOPE_READY_ID]: {
        title: "Ready",
        data: [],
      },
      [TODAY_SCOPE_COMPLETED_ID]: {
        title: "Completed",
        data: [],
      },
    };

    for (const id of ids) {
      const task = byId[id];

      if (isCompletedTodayTask(task)) {
        groupsById[TODAY_SCOPE_COMPLETED_ID].data.push(task);
      }

      if (!isTodayTask(task)) continue;

      if (task.deadline && task.deadline < today) {
        groupsById[TODAY_SCOPE_OVERDUE_ID].data.push(task);
      }

      if (task.deadline === today) {
        groupsById[TODAY_SCOPE_DUE_TODAY_ID].data.push(task);
      }

      if (!task.deadline || task.deadline > today) {
        groupsById[TODAY_SCOPE_READY_ID].data.push(task);
      }
    }

    const list: Task[] = [];

    Object.values(groupsById).forEach((group) => {
      list.push(...group.data);
    });

    return {
      total: list.length,
      list,
      groupsById,
    };
  },
);

export const selectUpcomingTasks = createSelector(
  [selectTaskIds, selectTasksById],
  (
    ids: string[],
    byId: Record<string, Task>,
  ): SelectDataReturn<UpcomingGroupId> => {
    const groupsById: GroupByIdType<UpcomingGroupId> = {
      [UPCOMING_SCOPE_UPCOMING_ID]: {
        title: "Upcoming",
        data: [],
      },
      [UPCOMING_SCOPE_WAITING_ID]: {
        title: "Waiting",
        data: [],
      },
      [UPCOMING_SCOPE_SOMEDAY_ID]: {
        title: "Someday",
        data: [],
      },
    };

    for (const id of ids) {
      const task = byId[id];

      if (!isUpcomingTask(task)) continue;

      if (task.status === "waiting") {
        groupsById[UPCOMING_SCOPE_WAITING_ID].data.push(task);
      }

      if (task.status === "someday") {
        groupsById[UPCOMING_SCOPE_SOMEDAY_ID].data.push(task);
      }

      if (task.status === "next") {
        groupsById[UPCOMING_SCOPE_UPCOMING_ID].data.push(task);
      }
    }

    const list: Task[] = [];

    Object.values(groupsById).forEach((group) => {
      list.push(...group.data);
    });

    return {
      total: list.length,
      groupsById,
      list,
    };
  },
);

export const selectGroupById = createSelector(
  [
    selectTodayTasks,
    selectUpcomingTasks,
    selectProjects,
    (_: RootState, groupId: ScopeGroupId) => groupId,
  ],
  (
    today: SelectDataReturn<TodayGroupId>,
    upcoming: SelectDataReturn<UpcomingGroupId>,
    projects: SelectDataReturn<ProjectsGroupId>,
    groupId: ScopeGroupId,
  ): GroupData => {
    const groupsById: GroupByIdType<ScopeGroupId> = {
      ...today.groupsById,
      ...upcoming.groupsById,
      ...projects.groupsById,
    };
    return groupsById[groupId];
  },
);

export const selectInboxTasks = createSelector(
  [selectTaskIds, selectTasksById, selectInboxOrder],
  (
    ids: string[],
    byId: Record<string, TaskStateData>,
    inboxOrder: OrderObject,
  ): TaskWithOrderKey[] => {
    return ids
      .filter((id) => isInboxTask(byId[id]))
      .sort((a, b) => inboxOrder[b] - inboxOrder[a])
      .map((id) => ({
        task: byId[id],
        order_key: inboxOrder[id],
      }));
  },
);

type ProjectTasksType = {
  name: string;
  data: TaskWithOrderKey[];
};

export const selectProjectTasks = createSelector(
  [
    selectTasksById,
    (state: RootState, projectId: string) =>
      state.projects.projects.byId[projectId],
  ],
  (byId: Record<string, TaskStateData>, project): ProjectTasksType => {
    const data = project.tasks
      .slice()
      .sort((a, b) => b.order_key - a.order_key)
      .flatMap((project) => {
        const task = byId[project.id];

        if (!task) return [];

        return [
          {
            task,
            order_key: project.order_key,
          },
        ];
      });

    return {
      name: project.name,
      data,
    };
  },
);
