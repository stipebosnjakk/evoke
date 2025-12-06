import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useColorTheme } from "@/hooks/useColorTheme";

// TODO: check the best forms on github
// TODO: check the blueprint form for creating post

const TitleAndDesc = () => {
  const { colors } = useColorTheme();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent]}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={colors.secondary}
            style={[
              styles.titleInput,
              { color: colors.text, borderBottomColor: colors.border },
            ]}
            multiline
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="body text (optional)"
            placeholderTextColor={colors.secondary}
            style={[styles.bodyInput, { color: colors.text }]}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bodyInput: {
    marginTop: 16,
    fontSize: 16,
    minHeight: 140,
    paddingHorizontal: 0,
  },
});

export default TitleAndDesc;
