import { createSelector } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";

import { Task } from "@/db";
import { RootState } from "@/store/store";
import { toIsoDate } from "@/utils/date";
import { ScopeGroupId, TaskWithOrderKey } from "@/types/task.types";
import {
  isCompletedTodayTask,
  isInboxTask,
  isTodayTask,
  isUpcomingTask,
} from "@/utils/taskPlacement";
import {
  GroupByIdType,
  TodayGroupsById,
  UpcomingGroupsById,
} from "@/types/initialState.types";
import {
  TODAY_SCOPE_COMPLETED_ID,
  TODAY_SCOPE_DUE_TODAY_ID,
  TODAY_SCOPE_OVERDUE_ID,
  TODAY_SCOPE_READY_ID,
  UPCOMING_SCOPE_SOMEDAY_ID,
  UPCOMING_SCOPE_UPCOMING_ID,
  UPCOMING_SCOPE_WAITING_ID,
} from "@/constants/scopeIds";

export const selectTaskIds = (state: RootState) => state.tasks.tasks.ids;
export const selectTasksById = (state: RootState) => state.tasks.tasks.byId;
export const selectInboxOrder = (state: RootState) =>
  state.tasks.taskOrder.inbox;

type SelectScreenReturn = {
  groupsById: GroupByIdType;
  list: Task[];
  total: number;
};

export const selectTodayTasks = createSelector(
  [selectTaskIds, selectTasksById],
  (ids, byId): SelectScreenReturn => {
    const today = toIsoDate(startOfToday());

    const groupsById: TodayGroupsById = {
      [TODAY_SCOPE_OVERDUE_ID]: {
        title: "Overdue",
        tasks: [],
      },
      [TODAY_SCOPE_DUE_TODAY_ID]: {
        title: "Due Today",
        tasks: [],
      },
      [TODAY_SCOPE_READY_ID]: {
        title: "Ready",
        tasks: [],
      },
      [TODAY_SCOPE_COMPLETED_ID]: {
        title: "Completed",
        tasks: [],
      },
    };

    for (const id of ids) {
      const task = byId[id];

      if (isCompletedTodayTask(task)) {
        groupsById[TODAY_SCOPE_COMPLETED_ID].tasks.push(task);
      }

      if (!isTodayTask(task)) continue;

      if (task.deadline && task.deadline < today) {
        groupsById[TODAY_SCOPE_OVERDUE_ID].tasks.push(task);
      }

      if (task.deadline === today) {
        groupsById[TODAY_SCOPE_DUE_TODAY_ID].tasks.push(task);
      }

      if (!task.deadline || task.deadline > today) {
        groupsById[TODAY_SCOPE_READY_ID].tasks.push(task);
      }
    }

    const list = [
      ...groupsById[TODAY_SCOPE_OVERDUE_ID].tasks,
      ...groupsById[TODAY_SCOPE_DUE_TODAY_ID].tasks,
      ...groupsById[TODAY_SCOPE_READY_ID].tasks,
    ];

    return {
      total: list.length,
      list,
      groupsById,
    };
  },
);

export const selectUpcomingTasks = createSelector(
  [selectTaskIds, selectTasksById],
  (ids, byId): SelectScreenReturn => {
    const groupsById: UpcomingGroupsById = {
      [UPCOMING_SCOPE_UPCOMING_ID]: {
        title: "Upcoming",
        tasks: [],
      },
      [UPCOMING_SCOPE_WAITING_ID]: {
        title: "Waiting",
        tasks: [],
      },
      [UPCOMING_SCOPE_SOMEDAY_ID]: {
        title: "Someday",
        tasks: [],
      },
    };

    for (const id of ids) {
      const task = byId[id];

      if (!isUpcomingTask(task)) continue;

      if (task.status === "waiting") {
        groupsById[UPCOMING_SCOPE_WAITING_ID].tasks.push(task);
      }

      if (task.status === "someday") {
        groupsById[UPCOMING_SCOPE_SOMEDAY_ID].tasks.push(task);
      }

      if (task.status === "next") {
        groupsById[UPCOMING_SCOPE_UPCOMING_ID].tasks.push(task);
      }
    }

    const list = [
      ...groupsById[UPCOMING_SCOPE_UPCOMING_ID].tasks,
      ...groupsById[UPCOMING_SCOPE_WAITING_ID].tasks,
      ...groupsById[UPCOMING_SCOPE_SOMEDAY_ID].tasks,
    ];

    return {
      total: list.length,
      groupsById,
      list,
    };
  },
);

type TodayGroupSelectReturn = {
  title: string;
  tasks: Task[];
};

export const selectTasksGroupById = createSelector(
  [
    selectTodayTasks,
    selectUpcomingTasks,
    (_: RootState, groupId: ScopeGroupId) => groupId,
  ],
  (today, upcoming, groupId): TodayGroupSelectReturn => {
    const group = today.groupsById[groupId] ?? upcoming.groupsById[groupId];

    return {
      title: group?.title ?? "Tasks",
      tasks: group?.tasks ?? [],
    };
  },
);

export const selectInboxTasks = createSelector(
  [selectTaskIds, selectTasksById, selectInboxOrder],
  (ids, byId, inboxOrder): TaskWithOrderKey[] => {
    return ids
      .filter((id) => isInboxTask(byId[id]))
      .sort((a, b) => inboxOrder[b] - inboxOrder[a])
      .map((id) => ({
        task: byId[id],
        order_key: inboxOrder[id],
      }));
  },
);
