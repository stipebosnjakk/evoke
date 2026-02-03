import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";

const QuickAddModal = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    console.log("Submitted:", t);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Add</Text>
      <Text style={styles.helper}>
        Use #Project, “tomorrow”, or “every week”.
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor="rgba(0,0,0,0.35)"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
        style={styles.input}
      />
      <View style={styles.actions}>
        <Pressable onPress={() => router.back()} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Close</Text>
        </Pressable>
        <Pressable onPress={submit} style={styles.btnPrimary}>
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
