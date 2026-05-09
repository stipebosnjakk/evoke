import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { getActiveTasksAction } from "@/store/tasks/thunks/fetch.thunks";

export const useLoadInitialTasks = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.tasks.status);
  useEffect(() => {
    if (status === "idle") {
      dispatch(getActiveTasksAction({ refresh: false }));
    }
  }, [dispatch, status]);
};
