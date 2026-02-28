import { PagedIdList, TasksState } from "@/types/initialState";
import { TaskWithOrderKey } from "@/types/task.types";
import {
  INBOX_CONTAINER_ID,
  PLAN_INRANGE_NEXT_CONTAINER_ID,
  PLAN_INRANGE_SOMEDAY_CONTAINER_ID,
  PLAN_INRANGE_WAITING_CONTAINER_ID,
  PLAN_OVERDUE_CONTAINER_ID,
  TODAY_CONTAINER_ID,
} from "@/utils/containerIds";

/**
 * Merges newly fetched tasks into the existing list while ensuring there are no duplicates.
 *
 * @param list List state where we merge new items.
 * @param data Newly fetched tasks containing `id` and `order_key`.
 * @param isRefresh Indicates if this is a refresh action, which should replace the list instead of appending.
 */

export const mergeNewListItems = (
  list: PagedIdList,
  data: TaskWithOrderKey[],
  isRefresh: boolean,
) => {
  const newIds = data.map((task) => ({
    id: task.id,
    order_key: task.order_key ?? 0,
  }));
  const base = isRefresh ? [] : list.ids;
  const merged = base.concat(newIds);

  const seen = new Set<string>();
  list.ids = merged.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

/**
 * Gets the list state corresponding to a given container ID.
 * This is used to determine which list to update when tasks are reordered.
 *
 * @param state Current tasks slice state.
 * @param containerId The container ID for which to retrieve the list.
 */
export const getListByContainerId = (
  state: TasksState,
  containerId: string,
): PagedIdList | null => {
  switch (containerId) {
    case INBOX_CONTAINER_ID:
      return state.lists.inbox;
    case TODAY_CONTAINER_ID:
      return state.lists.today;
    case PLAN_OVERDUE_CONTAINER_ID:
      return state.lists.plan.overdue;
    case PLAN_INRANGE_NEXT_CONTAINER_ID:
      return state.lists.plan.inRange.next;
    case PLAN_INRANGE_WAITING_CONTAINER_ID:
      return state.lists.plan.inRange.waiting;
    case PLAN_INRANGE_SOMEDAY_CONTAINER_ID:
      return state.lists.plan.inRange.someday;
    default:
      return null;
  }
};
