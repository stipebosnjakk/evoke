import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { quickAddTask } from "@/store/actions/tasks.actions";

// TODO: add toast message after creation, and on error

const QuickAddModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState<string>("");

  const { loading, error } = useAppSelector((state) => state.tasks);

  const goBack = () => {
    setTitle("");
    router.back();
  };

  const onSubmit = async () => {
    if (title.trim().length === 0) return;

    const result = await dispatch(quickAddTask({ title }));
    if (quickAddTask.fulfilled.match(result)) {
      goBack();
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Add</Text>
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
      />
      <View style={styles.actions}>
        <Pressable onPress={goBack} style={styles.btnSecondary}>
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

export default QuickAddModal;
