import { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createTaskAction } from "@/store/tasks/thunks/create.thunks";
import { handleErrorMessage } from "@/utils/handleErrorMessage";

// FIX: make error toast appear in front of modal background

const CreateTaskModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState<string>("");

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

    const trimmed = title.trim();
    if (trimmed.length === 0) {
      showErrorToast("Title is required");
      return;
    }
    if (trimmed.length > 255) {
      showErrorToast("Title must be less than 255 characters");
      return;
    }

    try {
      await dispatch(createTaskAction({ title: trimmed })).unwrap();
      Toast.show({
        type: "success",
        text1: "Task created",
        text2: trimmed,
      });
      setTitle("");
      router.back();
    } catch (error: unknown) {
      showErrorToast(handleErrorMessage(error, "Something went wrong."));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helper}>
        Try #Project, “tomorrow”, or “every week”.
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor="rgba(0,0,0,0.35)"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        style={styles.input}
        blurOnSubmit={true}
      />
      <View style={styles.actions}>
        <Pressable
          disabled={loading}
          onPress={() => router.back()}
          style={styles.btnSecondary}
        >
          <Text style={styles.btnSecondaryText}>Close</Text>
        </Pressable>
        <Pressable
          onPress={onSubmit}
          disabled={title.trim().length === 0 || loading}
          style={[
            styles.btnPrimary,
            { opacity: title.trim().length === 0 || loading ? 0.6 : 1 },
          ]}
        >
          <Text style={styles.btnPrimaryText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  helper: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.6,
  },
  input: {
    marginTop: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.04)",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 16,
  },
  btnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.75,
  },
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default CreateTaskModal;
