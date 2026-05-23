import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { deleteAllTasksAction } from "@/store/thunks/test.thunks";
import {
  getActiveTasksAction,
  getProjectsAction,
} from "@/store/thunks/fetch.thunks";

export const useLoadInitialData = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.tasks.status);
  useEffect(() => {
    if (status === "idle") {
      dispatch(getActiveTasksAction({ refresh: false }));
      dispatch(getProjectsAction());
      // TODO: remove
      // dispatch(deleteAllTasksAction())
    }
  }, [dispatch, status]);
};
