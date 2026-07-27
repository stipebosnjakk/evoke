import { defaultProjectColor } from "@/constants/colors";
import { FormProjectInitialState } from "@/types/initialState.types";

export const initialState: FormProjectInitialState = {
  loading: false,
  error: null,
  project: {
    name: "",
    color: defaultProjectColor,
  },
};
