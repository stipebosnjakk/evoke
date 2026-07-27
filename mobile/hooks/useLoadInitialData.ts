import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./storeHooks";
import { fetchActiveTasksAction } from "@/store/thunks/task/task.fetch.thunks";
import { fetchProjectsAction } from "@/store/thunks/project/project.fetch.thunks";
import { deleteAllTasksAction } from "@/store/thunks/test.thunks";

export const useLoadInitialData = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.tasks.status);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchActiveTasksAction({ refresh: false }));
      dispatch(fetchProjectsAction());
      // TODO: remove
      // dispatch(deleteAllTasksAction())
    }
  }, [dispatch, status]);
};
