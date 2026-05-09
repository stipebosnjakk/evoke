import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Task } from "@/db";
import { TaskWithOrderKey } from "@/types/task.types";

export const selectTaskIds = (state: RootState) => state.tasks.tasks.ids;
export const selectTasksById = (state: RootState) => state.tasks.tasks.byId;
export const selectInboxOrder = (state: RootState) =>
  state.tasks.taskOrder.inbox;

export const isInboxTask = (task: Task) => {
  return (
    !task.is_completed &&
    !task.is_deleted &&
    !task.area_id &&
    !task.project_id &&
    !task.section_id &&
    !task.status &&
    !task.start_date &&
    !task.deadline
  );
};

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
