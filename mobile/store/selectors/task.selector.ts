import { createSelector } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";

import { Task } from "@/db";
import { RootState } from "@/store/store";
import { toIsoDate } from "@/utils/date";
import { selectProjects } from "@/store/selectors/projects.selector";
import {
  GroupTasks,
  InboxGroupId,
  ProjectsGroupId,
  TodayGroupId,
  UpcomingGroupId,
} from "@/types/scope.types";
import {
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
  INBOX_SCOPE_ACTIVE_ID,
  INBOX_SCOPE_COMPLETED_ID,
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

export const selectInboxTasks = createSelector(
  [selectTaskIds, selectTasksById, selectInboxOrder],
  (
    ids: string[],
    byId: Record<string, TaskStateData>,
    inboxOrder: OrderObject,
  ): GroupByIdType<InboxGroupId> => {
    const groupsById: GroupByIdType<InboxGroupId> = {
      [INBOX_SCOPE_ACTIVE_ID]: {
        title: "Inbox",
        data: [],
      },
      [INBOX_SCOPE_COMPLETED_ID]: {
        title: "Completed",
        data: [],
      },
    };

    for (const id of ids) {
      const task = byId[id];

      if (task.is_completed) {
        groupsById[INBOX_SCOPE_COMPLETED_ID].data.push(task);
      } else if (isInboxTask(task)) {
        groupsById[INBOX_SCOPE_ACTIVE_ID].data.push({
          task,
          order_key: inboxOrder[id] ?? 0,
        });
      }
    }

    groupsById[INBOX_SCOPE_COMPLETED_ID].data.sort(
      (a, b) => b.completed_at_utc - a.completed_at_utc,
    );

    groupsById[INBOX_SCOPE_ACTIVE_ID].data.sort(
      (a, b) => b.order_key - a.order_key,
    );

    return groupsById;
  },
);

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
    };

    for (const id of ids) {
      const task = byId[id];

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
    byId: Record<string, TaskStateData>,
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
    (_: RootState, groupId: GroupTasks) => groupId,
  ],
  (
    today: SelectDataReturn<TodayGroupId>,
    upcoming: SelectDataReturn<UpcomingGroupId>,
    projects: SelectDataReturn<ProjectsGroupId>,
    groupId: GroupTasks,
  ): GroupData => {
    const groupsById: GroupByIdType<GroupTasks> = {
      ...today.groupsById,
      ...upcoming.groupsById,
      ...projects.groupsById,
    };
    return groupsById[groupId];
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

export const selectTasksWithoutProject = createSelector(
  [selectTaskIds, selectTasksById],
  (ids: string[], byId: Record<string, TaskStateData>): TaskStateData[] => {
    return ids
      .map((id) => byId[id])
      .filter(
        (task) =>
          task.project_id == null && task.project == null && !task.is_completed,
      );
  },
);

export const selectTaskById = (
  state: RootState,
  taskId: string,
): TaskStateData | undefined => selectTasksById(state)[taskId];
