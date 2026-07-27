import { Text, StyleSheet, TextInput, Pressable, Keyboard } from "react-native";
import { useRef, useState } from "react";

import { useAppDispatch } from "@/hooks/storeHooks";

// TODO: title is overflowing

type TaskTitleType = {
  fontSize: number;
  title: string;
  lineHeight: number;
  multiline: boolean;
  isCompletedOrCompleting: boolean;
};

const TaskTitle = ({
  fontSize,
  title,
  multiline,
  lineHeight,
  isCompletedOrCompleting,
}: TaskTitleType) => {
  const dispatch = useAppDispatch();

  const titleInputRef = useRef<TextInput>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  const onTitleChange = () => {};
  const onTitlePress = () => {};

  return isEditingTitle ? (
    <TextInput
      ref={titleInputRef}
      autoFocus
      value={titleDraft}
      onChangeText={onTitleChange}
      maxLength={255}
      multiline
      scrollEnabled={false}
      selectionColor="#52525B"
      style={[styles.title, styles.titleInput]}
    />
  ) : (
    <Pressable onPress={onTitlePress} style={styles.titlePressable}>
      <Text
        style={[
          styles.title,
          {
            fontSize,
            lineHeight,
          },
          isCompletedOrCompleting && styles.taskTitleCompleted,
        ]}
        numberOfLines={multiline ? undefined : 1}
        ellipsizeMode={multiline ? undefined : "tail"}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    minWidth: 0,
    fontWeight: "600",
    color: "#1F1F1D",
  },
  taskTitleCompleted: {
    color: "#8C8C87",
    textDecorationLine: "line-through",
    textDecorationColor: "#8C8C87",
  },
  titlePressable: {
    flex: 1,
  },
  titleInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
});

export default TaskTitle;
