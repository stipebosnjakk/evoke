import { defaultProjectColor } from "@/constants/colors";
import { NewProjectInitialState } from "@/types/initialState.types";

export const initialState: NewProjectInitialState = {
  loading: false,
  error: null,
  project: {
    name: "",
    color: defaultProjectColor,
  },
};
