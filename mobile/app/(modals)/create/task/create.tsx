import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createTaskAction } from "@/store/tasks/thunks/create.thunks";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import { routes } from "@/consts/routes";
import DropdownStatus from "@/components/create/task/DropdownStatus";
import Chip from "@/components/ui/Chip";
import { setDescription, setTitle } from "@/store/tasks/slices/newTask.slice";

const CreateTaskModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.tasks.loading);
  const title = useAppSelector((state) => state.newTask.inputs.title);
  const description = useAppSelector(
    (state) => state.newTask.inputs.description,
  );

  const showErrorToast = (message: string) => {
    Toast.show({
      type: "error",
      text1: "Failed to create a task",
      text2: message || "Something went wrong.",
    });
  };

  const onSubmit = async () => {
    if (loading) return;

    try {
      await dispatch(createTaskAction()).unwrap();
      Toast.show({
        type: "success",
        text1: "Task created",
      });
    } catch (error: unknown) {
      showErrorToast(handleErrorMessage(error, "Something went wrong."));
    }
  };

  // NEXT TODO: organize this code
  // TODO: after creation keep modal active so user can create more tasks instantlly

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.helper}>
          Try #Project, “tomorrow”, or “every week”.
        </Text>
        <View style={styles.fields}>
          <TextInput
            value={title || ""}
            onChangeText={(text) => dispatch(setTitle({ title: text }))}
            placeholder="Task title"
            placeholderTextColor="rgba(0,0,0,0.35)"
            autoFocus
            returnKeyType="next"
            style={styles.titleInput}
            blurOnSubmit={false}
            keyboardType="twitter"
          />
          <TextInput
            value={description || ""}
            onChangeText={(text) =>
              dispatch(setDescription({ description: text }))
            }
            placeholder="Description"
            placeholderTextColor="rgba(0,0,0,0.35)"
            multiline
            style={styles.descriptionInput}
            textAlignVertical="top"
            keyboardType="twitter"
          />
        </View>
      </View>
      <View>
        <View collapsable={false}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.row}>
              <DropdownStatus />
              <Chip
                icon="calendar"
                label="Date"
                onPress={() => {
                  router.push(routes.date.href);
                }}
              />
              <Chip
                icon="calendar.badge.clock"
                label="Deadline"
                onPress={() => {
                  router.push(routes.deadline.href);
                }}
              />
              <Chip
                icon="repeat"
                label="Repeat"
                onPress={() => {
                  router.push(routes.repeat.href);
                }}
              />
            </View>
          </ScrollView>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={onSubmit}
            disabled={title?.trim().length === 0 || loading}
            style={[
              styles.btnPrimary,
              { opacity: title?.trim().length === 0 || loading ? 0.6 : 1 },
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
    </View>
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
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    borderBottomColor: "rgba(0,0,0,0.06)",
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});

export default CreateTaskModal;
