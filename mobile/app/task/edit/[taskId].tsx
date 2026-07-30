import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import SheetHeader from "@/components/custom/SheetHeader";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { updateTaskInputsAction } from "@/store/thunks/task/task.crud.thunks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { getErrorMessage } from "@/utils/error";
import Toast from "react-native-toast-message";
import { validateTaskDescription, validateTaskTitle } from "@/utils/validate";

type LocalSearchParamsType = {
  taskId?: string;
  editInput?: "title" | "description";
};

const EditTaskInputsFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { taskId, editInput } = useLocalSearchParams<LocalSearchParamsType>();

  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : undefined,
  );

  const titleRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
  }, [task]);

  useEffect(() => {
    if (!task) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (editInput === "description") {
        descriptionRef.current?.focus();
        return;
      }

      titleRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [task, editInput]);

  if (!taskId || !task) {
    return null;
  }

  const handleOnClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: routes.single_task.href,
      params: { taskId },
    });
  };

  const handleSubmit = async () => {
    try {
      const titleValidation = validateTaskTitle({ title });

      if (!titleValidation.ok) {
        throw new Error(titleValidation.message);
      }

      const descriptionValidation = validateTaskDescription({ description });

      if (!descriptionValidation.ok) {
        throw new Error(descriptionValidation.message);
      }

      await dispatch(
        updateTaskInputsAction({
          taskId,
          title: titleValidation.data,
          description: descriptionValidation.data,
        }),
      ).unwrap();

      handleOnClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to update task"),
      });
    }
  };

  return (
    <SheetWrapper>
      <SheetHeader
        title="Edit task"
        onClose={handleOnClose}
        submitButtonVisible
        onSubmit={handleSubmit}
        submitDisabled={!title.trim()}
      />
      <View style={styles.formContainer}>
        <View style={styles.fields}>
          <TextInput
            ref={titleRef}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#a5a5a5"
            returnKeyType="next"
            blurOnSubmit={false}
            keyboardType="twitter"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            style={styles.titleInput}
          />
          <TextInput
            ref={descriptionRef}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor="#a5a5a5"
            multiline
            scrollEnabled
            textAlignVertical="top"
            keyboardType="twitter"
            style={styles.descriptionInput}
          />
        </View>
      </View>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
  },
  fields: {
    marginTop: 16,
    gap: 10,
  },
  titleInput: {
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  descriptionInput: {
    minHeight: 120,
    maxHeight: 240,
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
  },
});

export default EditTaskInputsFormSheet;
