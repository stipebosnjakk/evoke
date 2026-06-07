import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { STATUS_OPTIONS } from "@/constants/status";
import { TaskStatusOption } from "@/types/task.types";
import { setStatus } from "@/store/slices/newTask.slice";
import { useAppSelector } from "@/hooks/storeHooks";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import { validateTaskStatus } from "@/utils/validate";
import SheetHeader from "@/components/custom/SheetHeader";
import Info from "@/components/ui/Info";

const StatusFormSheet = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const statusValue = useAppSelector((state) => state.newTask.task.status);

  const handleSubmitStatus = (optionValue: TaskStatusOption) => {
    if (statusValue === optionValue.value) {
      dispatch(setStatus({ status: null }));
      router.back();
      return;
    }

    const res = validateTaskStatus(optionValue);

    if (!res.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Status",
        text2: res.message,
      });
      return;
    }

    dispatch(setStatus({ status: optionValue }));
    router.back();
  };

  // TODO: edit SheetHeader title
  return (
    <SheetWrapper>
      <SheetHeader title="Status" onClose={() => router.back()} />
      <View style={styles.wrapper}>
        <View>
          {STATUS_OPTIONS.map((item, index) => {
            const isSelected = statusValue === item.value;
            const isLast = index === STATUS_OPTIONS.length - 1;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSubmitStatus(item)}
                style={styles.optionsButton}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <SymbolView
                    name={item.icon as any}
                    weight="medium"
                    size={20}
                    type="monochrome"
                    tintColor="rgb(67, 67, 67)"
                  />
                  <View
                    style={[
                      styles.borderContainer,
                      { flex: 1, borderBottomWidth: isLast ? 0 : 1 },
                    ]}
                  >
                    <Text style={styles.labels}>{item.label}</Text>
                    {isSelected && (
                      <SymbolView
                        name="checkmark"
                        weight="medium"
                        size={20}
                        type="monochrome"
                        tintColor="rgb(67, 67, 67)"
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <Info text="A task must have Next status to appear in Today." />
      </View>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  optionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  borderContainer: {
    borderBottomColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labels: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
    padding: 14,
  },
});

export default StatusFormSheet;
