import { createSelector } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";

import { RootState } from "@/store/store";
import { TaskWithOrderKey } from "@/types/task.types";
import {
  isCompletedTodayTask,
  isInboxTask,
  isTodayTask,
} from "@/utils/taskPlacement";
import { toIsoDate } from "@/utils/date";
import { Task } from "@/db";
import {
  TODAY_SCOPE_COMPLETED_ID,
  TODAY_SCOPE_DUE_TODAY_ID,
  TODAY_SCOPE_OVERDUE_ID,
  TODAY_SCOPE_READY_ID,
} from "@/constants/scopeIds";

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
    const todayDate = startOfToday();
    const today = toIsoDate(todayDate);

    const overdue: Task[] = [];
    const dueToday: Task[] = [];
    const ready: Task[] = [];
    const completed: Task[] = [];

    for (const id of ids) {
      const task = byId[id];

      if (isCompletedTodayTask(task)) {
        completed.push(task);
      }
      if (!isTodayTask(task, todayDate)) continue;
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
      total: overdue.length + dueToday.length + ready.length,
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
