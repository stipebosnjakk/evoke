import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { routes } from "@/constants/routes";
import { type TaskStateData } from "@/types/task.types";

type TaskDescriptionProps = {
  task: TaskStateData;
};

const FormTaskDescription = ({ task }: TaskDescriptionProps) => {
  const router = useRouter();

  const description = task.description?.trim() ?? "";

  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
    setNeedsExpansion(false);
    setHasMeasured(false);
  }, [description]);

  const handleOnTextLayout = (nativeEvent: TextLayoutEventData) => {
    if (hasMeasured) return;

    setNeedsExpansion(nativeEvent.lines.length > 2);
    setHasMeasured(true);
  };

  const handleDescriptionPress = () => {
    router.push({
      pathname: routes.form_task_inputs.href,
      params: {
        taskId: task.id,
        editInput: "description",
      },
    });
  };

  if (!description) {
    return (
      <Pressable style={styles.container} onPress={handleDescriptionPress}>
        <Text style={styles.emptyText}>No description</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.container} onPress={handleDescriptionPress}>
      <Text
        style={[styles.text, !hasMeasured && styles.measuring]}
        numberOfLines={hasMeasured && !isExpanded ? 2 : undefined}
        onTextLayout={({ nativeEvent }) => handleOnTextLayout(nativeEvent)}
      >
        {description}
      </Text>
      {hasMeasured && needsExpansion && (
        <TouchableOpacity
          onPress={() => setIsExpanded((current) => !current)}
          activeOpacity={0.7}
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>
            {isExpanded ? "Show less" : "Show more"}
          </Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  text: {
    color: "#52525B",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  measuring: {
    opacity: 0,
  },
  toggle: {
    alignSelf: "flex-start",
  },
  toggleText: {
    color: "#71717A",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  emptyText: {
    color: "#A1A1AA",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontStyle: "italic",
  },
});

export default FormTaskDescription;
