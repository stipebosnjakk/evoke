import { ContainerIdType } from "@/types/task.types";
import { TasksState } from "@/types/initialState.types";
import { PayloadAction } from "@reduxjs/toolkit";

// TODO: this function does not make any logic

export const changeContainerIdReducer = (
  state: TasksState,
  action: PayloadAction<{ containerId: ContainerIdType }>,
) => {
  const { containerId } = action.payload;

  if (containerId === null) {
    state.containerId = null;
    state.error = null;
    return;
  }

  if (typeof containerId !== "string" || containerId.trim() === "") {
    state.error = "Container ID is required";
    return;
  }

  if (state.containerId === containerId) return;

  state.error = null;
  state.containerId = containerId;
};
