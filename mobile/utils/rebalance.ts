import { TaskWithOrderKey } from "@/types/task.types";

// FIX
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
    const step = (topAnchor.order_key - bottomAnchor.order_key) / (len + 1);
    const top = topAnchor.order_key - step;
    const bottom = topAnchor.order_key - 2 * step;
    return { newTopOrderKey: top, newBottomOrderKey: bottom };
  }

  if (topAnchor && Number.isFinite(topAnchor.order_key)) {
    const top = topAnchor.order_key - GAP;
    const bottom = topAnchor.order_key - 2 * GAP;
    return { newTopOrderKey: top, newBottomOrderKey: bottom };
  }
  if (bottomAnchor && Number.isFinite(bottomAnchor.order_key)) {
    const top = bottomAnchor.order_key + 2 * GAP;
    const bottom = bottomAnchor.order_key + GAP;
    return { newTopOrderKey: top, newBottomOrderKey: bottom };
  }
  return { newTopOrderKey: 2 * GAP, newBottomOrderKey: GAP };
};
