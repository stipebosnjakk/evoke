import { createSelector } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";

import { RootState } from "@/store/store";
import { ScopeGroupId, TaskWithOrderKey } from "@/types/task.types";
import {
  isCompletedTodayTask,
  isInboxTask,
  isTodayTask,
  isUpcomingTask,
} from "@/utils/taskPlacement";
import { toIsoDate } from "@/utils/date";
import { Task } from "@/db";
import {
  TODAY_SCOPE_COMPLETED_ID,
  TODAY_SCOPE_DUE_TODAY_ID,
  TODAY_SCOPE_OVERDUE_ID,
  TODAY_SCOPE_READY_ID,
  UPCOMING_SCOPE_SOMEDAY_ID,
  UPCOMING_SCOPE_UPCOMING_ID,
  UPCOMING_SCOPE_WAITING_ID,
} from "@/constants/scopeIds";
import { GroupByIdType } from "@/types/initialState.types";

export const selectTaskIds = (state: RootState) => state.tasks.tasks.ids;
export const selectTasksById = (state: RootState) => state.tasks.tasks.byId;
export const selectInboxOrder = (state: RootState) =>
  state.tasks.taskOrder.inbox;

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

type TodaySelectReturn = {
  total: number;
  list: Task[];
  overdue: Task[];
  dueToday: Task[];
  ready: Task[];
  completed: Task[];
};

export const selectTodayTasks = createSelector(
  [selectTaskIds, selectTasksById],
  (ids, byId): TodaySelectReturn => {
    const today = toIsoDate(startOfToday());

    const overdue: Task[] = [];
    const dueToday: Task[] = [];
    const ready: Task[] = [];
    const completed: Task[] = [];

    for (const id of ids) {
      const task = byId[id];

      if (isCompletedTodayTask(task)) {
        completed.push(task);
      }
      if (!isTodayTask(task)) continue;
      if (task.deadline && task.deadline < today) {
        overdue.push(task);
      } else if (task.deadline === today) {
        dueToday.push(task);
      } else {
        ready.push(task);
      }
    }

    const list = [...overdue, ...dueToday, ...ready];

    return {
      total: list.length,
      list,
      overdue,
      dueToday,
      ready,
      completed,
    };
  },
);

type TodayGroupSelectReturn = {
  title: string;
  tasks: Task[];
};

export const selectTodayGroupById = createSelector(
  [selectTodayTasks, (_: RootState, scopeId: string) => scopeId],
  (today, scopeId): TodayGroupSelectReturn => {
    switch (scopeId) {
      case TODAY_SCOPE_OVERDUE_ID:
        return {
          title: "Overdue",
          tasks: today.overdue,
        };
      case TODAY_SCOPE_DUE_TODAY_ID:
        return {
          title: "Due Today",
          tasks: today.dueToday,
        };
      case TODAY_SCOPE_READY_ID:
        return {
          title: "Ready",
          tasks: today.ready,
        };
      case TODAY_SCOPE_COMPLETED_ID:
        return {
          title: "Completed",
          tasks: today.completed,
        };
      default:
        return {
          title: "Tasks",
          tasks: [],
        };
    }
  },
);

type UpcomingSelectReturn = {
  groupsById: GroupByIdType;
  list: Task[];
  total: number;
};

export const selectUpcomingTasks = createSelector(
  [selectTaskIds, selectTasksById],
  (ids, byId): UpcomingSelectReturn => {
    const upcomingGroupsById: GroupByIdType = {
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
        const waitingGroup = upcomingGroupsById[UPCOMING_SCOPE_WAITING_ID];
        if (waitingGroup) {
          waitingGroup.tasks.push(task);
        }
      }

      if (task.status === "someday") {
        const somedayGroup = upcomingGroupsById[UPCOMING_SCOPE_SOMEDAY_ID];
        if (somedayGroup) {
          somedayGroup.tasks.push(task);
        }
      }

      if (task.status === "next") {
        const upcomingGroup = upcomingGroupsById[UPCOMING_SCOPE_UPCOMING_ID];
        if (upcomingGroup) {
          upcomingGroup.tasks.push(task);
        }
      }
    }

    const list = [
      ...(upcomingGroupsById[UPCOMING_SCOPE_UPCOMING_ID]?.tasks ?? []),
      ...(upcomingGroupsById[UPCOMING_SCOPE_WAITING_ID]?.tasks ?? []),
      ...(upcomingGroupsById[UPCOMING_SCOPE_SOMEDAY_ID]?.tasks ?? []),
    ];

    return {
      total: list.length,
      groupsById: upcomingGroupsById,
      list,
    };
  },
);
