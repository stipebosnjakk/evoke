import { ContainerIdType } from "@/types/create.types";
import { TasksState } from "@/types/initialState";

type ActionPayload = {
  payload: {
    containerId: ContainerIdType;
  };
};

export const changeContainerIdReducer = (
  state: TasksState,
  action: ActionPayload,
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
