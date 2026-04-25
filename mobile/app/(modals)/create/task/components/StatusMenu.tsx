import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import Chip from "@/components/ui/Chip";
import { STATUS_OPTIONS } from "@/constants/status";
import { useAppSelector } from "@/hooks/storeHooks";
import { useDispatch } from "react-redux";
import { setStatus } from "@/store/tasks/slices/newTask.slice";

const StatusMenu = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);

  const statusValue = useAppSelector((state) => state.newTask.task.status);
  const status = STATUS_OPTIONS.find((s) => s.value === statusValue);

  const handleSelect = (item: (typeof STATUS_OPTIONS)[number] | null) => {
    setOpen(false);
    if (item == null || item.value === statusValue) {
      dispatch(setStatus({ status: null }));
      return;
    }
    dispatch(setStatus({ status: item }));
  };

  return (
    <>
      <Chip
        icon={status ? status.icon : "tag"}
        label={status ? status.label : "Status"}
        onPress={() => {
          setOpen(!open);
        }}
      />
      <View>
        {open && (
          <View style={styles.popoverContent}>
            {STATUS_OPTIONS.map((item) => {
              const selected = status?.value === item.value;
              return (
                <Pressable
                  key={item.value}
                  onPress={() => handleSelect(item)}
                  style={[styles.item, selected && styles.itemSelected]}
                >
                  <View style={styles.itemInner}>
                    <SymbolView
                      name={item.icon as any}
                      weight="medium"
                      size={18}
                      type="monochrome"
                      tintColor={selected ? "black" : "rgb(67, 67, 67)"}
                    />
                    <Text style={styles.itemText}>{item.label}</Text>
                  </View>
                </Pressable>
              );
            })}
            {statusValue && (
              <Pressable
                onPress={() => {
                  handleSelect(null);
                }}
                style={styles.item}
              >
                <View style={styles.itemInner}>
                  <SymbolView
                    name="xmark"
                    weight="medium"
                    size={18}
                    type="monochrome"
                    tintColor={"rgb(67, 67, 67)"}
                  />
                  <Text style={styles.itemText}>None</Text>
                </View>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  popoverContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 240,
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 4,
  },
  item: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  itemSelected: {
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  itemInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgb(67, 67, 67)",
  },
});

export default StatusMenu;
