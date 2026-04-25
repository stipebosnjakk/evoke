import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";
import { STATUS_OPTIONS } from "@/constants/status";
import { TaskStatusOptionsArray } from "@/types/task.types";
import { setStatus } from "@/store/tasks/slices/newTask.slice";
import { useAppSelector } from "@/hooks/storeHooks";

const StatusFormSheet = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const statusValue = useAppSelector((state) => state.newTask.task.status);
  const status = STATUS_OPTIONS.find((s) => s.value === statusValue);

  const [selected, setSelected] = useState<TaskStatusOptionsArray | null>(
    status ?? null,
  );

  const handleSubmitStatus = () => {
    console.log("submit");
    dispatch(setStatus({ status: selected }));
    setSelected(null);
    router.back();
  };

  const handleSelectOption = (optionValue: TaskStatusOptionsArray) => {
    if (selected?.value === optionValue.value) {
      setSelected(null);
      return;
    }
    setSelected(optionValue);
  };

  const handleGoBack = () => {
    setSelected(null);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Button iconOnly onPress={handleGoBack}>
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
        <Text style={styles.title}>Status</Text>
        <Button
          style={{
            opacity: !selected && !status ? 0.5 : 1,
          }}
          disabled={!selected && !status}
          iconOnly
          onPress={handleSubmitStatus}
        >
          <SymbolView
            name="checkmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          {STATUS_OPTIONS.map((item, index) => {
            const isSelected = selected?.value === item.value;
            const isLast = index === STATUS_OPTIONS.length - 1;

            return (
              <Button
                key={index}
                onPress={() => handleSelectOption(item)}
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
              </Button>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  wrapper: {
    padding: 20,
  },
  card: {
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 20,
    overflow: "hidden",
  },
  optionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  borderContainer: {
    borderBottomColor: "rgba(0,0,0,0.06)",
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
