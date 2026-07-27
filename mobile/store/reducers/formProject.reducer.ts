import { PayloadAction } from "@reduxjs/toolkit";

import { FormProjectInitialState } from "@/types/initialState.types";
import { validateProjectColor, validateProjectName } from "@/utils/validate";
import { initialState } from "@/store/initialStates/formProject.initialState";

export const setNameReducer = (
  state: FormProjectInitialState,
  action: PayloadAction<{ name: string }>,
) => {
  state.project.name = action.payload.name;
};

export const setColorReducer = (
  state: FormProjectInitialState,
  action: PayloadAction<{ color: string }>,
) => {
  state.project.color = action.payload.color;
};

export const validateNameAndColorReducer = (state: FormProjectInitialState) => {
  const validateName = validateProjectName(state.project.name);

  if (!validateName.ok) {
    state.error = validateName.message;
    return;
  }

  const validateColor = validateProjectColor(state.project.color);

  if (!validateColor.ok) {
    state.error = validateColor.message;
    return;
  }

  state.project.name = validateName.data;
  state.project.color = validateColor.data;
  state.error = null;
};

export const clearProjectStateReducer = () => initialState;
