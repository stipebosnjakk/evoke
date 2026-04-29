import { TaskWithOrderKey } from "@/types/task.types";

// FIX

/**
 * Calculates the new order_key for a task after you drag it somewhere.
 * It looks at the task above it, the task below it, and creates a number that fits between them.
 * @param top task above the moved task, or null if moved to the top
 * @param bottom task below the moved task, or null if moved to the bottom
 * @param moved the task being moved
 * @param GAP The gap between order keys to maintain space for future moves without needing to rebalance immediately
 * @returns The new order_key for the moved task
 */
export const calculateNewOrderKey = (
  top: TaskWithOrderKey | null,
  bottom: TaskWithOrderKey | null,
  moved: TaskWithOrderKey,
  GAP: number,
): number => {
  if (top && bottom) return (top.order_key + bottom.order_key) / 2;
  if (!top && bottom) return bottom.order_key + GAP;
  if (top && !bottom) return top.order_key - GAP;
  return moved.order_key;
};

/**
 * This checks whether the space between two order_keys is broken or too small.
 * @param top The task above the moved task, or null if moved to the top
 * @param bottom The task below the moved task, or null if moved to the bottom
 * @returns true if we need to rebalance, false if the order_keys are still valid
 */
export const checkForRebalance = (
  top: TaskWithOrderKey | null,
  bottom: TaskWithOrderKey | null,
): boolean => {
  if (!top || !bottom) return false;

  if (!Number.isFinite(top.order_key) || !Number.isFinite(bottom.order_key))
    return true;

  if (top.order_key <= bottom.order_key) return true;

  const midOrderKey = (top.order_key + bottom.order_key) / 2;

  if (midOrderKey === top.order_key || midOrderKey === bottom.order_key)
    return true;

  return false;
};

/**
 * This creates fresh order_keys when the current keys are too close or broken.
 * @param newData The array of tasks
 * @param to The index of the task being moved
 * @param GAP The gap between order keys to maintain space for future moves without needing to rebalance immediately
 * @returns An object containing the new order_keys for the tasks above and below the moved task
 */
export const handleRebalance = (
  newData: TaskWithOrderKey[],
  to: number,
  GAP: number,
): {
  newTopOrderKey: number;
  newBottomOrderKey: number;
} => {
  const topAnchor = newData[to - 2] || null;
  const bottomAnchor = newData[to + 2] || null;
  const len = 2;

  if (
    topAnchor &&
    bottomAnchor &&
    Number.isFinite(topAnchor.order_key) &&
    Number.isFinite(bottomAnchor.order_key) &&
    topAnchor.order_key > bottomAnchor.order_key
  ) {
    // Split the space between anchors into equal parts for two new order keys.
    const step = (topAnchor.order_key - bottomAnchor.order_key) / (len + 1);
    const top = topAnchor.order_key - step;
    const bottom = topAnchor.order_key - 2 * step;
    return { newTopOrderKey: top, newBottomOrderKey: bottom };
  }

  if (topAnchor && Number.isFinite(topAnchor.order_key)) {
    // If we only have a top anchor, place both new keys below it.
    const top = topAnchor.order_key - GAP;
    const bottom = topAnchor.order_key - 2 * GAP;
    return { newTopOrderKey: top, newBottomOrderKey: bottom };
  }
  if (bottomAnchor && Number.isFinite(bottomAnchor.order_key)) {
    // If we only have a bottom anchor, place both new keys above it.
    const top = bottomAnchor.order_key + 2 * GAP;
    const bottom = bottomAnchor.order_key + GAP;
    return { newTopOrderKey: top, newBottomOrderKey: bottom };
  }
  return { newTopOrderKey: 2 * GAP, newBottomOrderKey: GAP };
};
