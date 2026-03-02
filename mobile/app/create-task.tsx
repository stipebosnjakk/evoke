import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createTaskAction } from "@/store/tasks/thunks/create.thunks";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import { SymbolView } from "expo-symbols";
import Chip from "@/components/ui/Chip";
import { TaskStatusOption } from "@/types/task.types";
import DropdownStatus from "@/components/custom/DropdownStatus";

const CreateTaskModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const descriptionRef = useRef<TextInput>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<TaskStatusOption | null>(null);

  const loading = useAppSelector((state) => state.tasks.loading);

  const showErrorToast = (message: string) => {
    Toast.show({
      type: "error",
      text1: "Failed to create a task",
      text2: message || "Something went wrong.",
    });
  };

  const onSubmit = async () => {
    if (loading) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length === 0) {
      showErrorToast("Title is required");
      return;
    }
    if (trimmedTitle.length > 255) {
      showErrorToast("Title must be less than 255 characters");
      return;
    }
    if (trimmedDescription.length > 5000) {
      showErrorToast("Description must be less than 5000 characters");
      return;
    }

    try {
      await dispatch(createTaskAction({ title: trimmedTitle })).unwrap();
      Toast.show({
        type: "success",
        text1: "Task created",
        text2: trimmedTitle,
      });
      setTitle("");
      setDescription("");
      router.back();
    } catch (error: unknown) {
      showErrorToast(handleErrorMessage(error, "Something went wrong."));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.helper}>
          Try #Project, “tomorrow”, or “every week”.
        </Text>
        <View style={styles.fields}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor="rgba(0,0,0,0.35)"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            style={styles.titleInput}
            blurOnSubmit={false}
          />
          <TextInput
            ref={descriptionRef}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor="rgba(0,0,0,0.35)"
            multiline
            style={styles.descriptionInput}
            textAlignVertical="top"
          />
        </View>
      </View>
      <View>
        <View style={styles.row}>
          <DropdownStatus status={status} setStatus={setStatus} />
          <Chip icon="calendar" label="Schedule" />
          <Chip icon="repeat" label="Repeat" />
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={onSubmit}
            disabled={title.trim().length === 0 || loading}
            style={[
              styles.btnPrimary,
              { opacity: title.trim().length === 0 || loading ? 0.6 : 1 },
            ]}
          >
            <SymbolView
              name="plus"
              weight="medium"
              size={18}
              type="monochrome"
              tintColor="white"
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  helper: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.6,
  },
  fields: {
    marginTop: 16,
    gap: 10,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  descriptionInput: {
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    minHeight: 80,
    opacity: 0.9,
    maxHeight: 130,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  btnPrimary: {
    padding: 15,
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    borderBottomColor: "rgba(0,0,0,0.06)",
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingLeft: 16,
  },
});

export default CreateTaskModal;
