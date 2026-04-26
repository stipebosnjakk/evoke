import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { clearCreateTaskError } from "@/store/tasks/slices/newTask.slice";
import { clearTaskScreenError } from "@/store/tasks/slices/tasks.slice";

export default function GlobalToastListener() {
  const dispatch = useAppDispatch();

  const newTaskError = useAppSelector((state) => state.newTask.error);
  const screensError = useAppSelector((state) => state.tasks.error);
  

  useEffect(() => {
    if (!newTaskError) return;
    Toast.show({
      type: "error",
      text1: "Task error",
      text2: newTaskError,
    });

    dispatch(clearCreateTaskError());
  }, [newTaskError]);

  useEffect(() => {
    if (!screensError) return;
    Toast.show({
      type: "error",
      text1: "Screens error",
      text2: screensError,
    });

    dispatch(clearTaskScreenError());
  }, [screensError]);

  return null;
}
