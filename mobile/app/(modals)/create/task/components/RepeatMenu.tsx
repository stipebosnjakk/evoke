import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { SymbolView } from "expo-symbols";
import { parseISO } from "date-fns";

import { useAppSelector } from "@/hooks/storeHooks";
import { getRepeatOptions } from "@/utils/date";
import Chip from "@/components/ui/Chip";

const RepeatMenu = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);

  const startDateValue = useAppSelector(
    (state) => state.newTask.task.start_date,
  );
  const repeatValue = useAppSelector((state) => state.newTask.task.repeat);

  const REPEAT_OPTIONS = getRepeatOptions(
    startDateValue ? parseISO(startDateValue) : new Date(),
  );

  const repeat = REPEAT_OPTIONS.find(
    (r) => r.repeat?.type === repeatValue?.type,
  );

  const handleSelect = (item: any) => {};

  return (
    <View style={{position: "relative"}}>
      <Pressable
        onPress={() => {
          setOpen(!open);
        }}
      >
        <Chip
          icon={repeat ? repeat.icon : "repeat"}
          label={repeat ? repeat.label : "Repeat"}
        />
      </Pressable>
      {open && (
        <View style={styles.popoverContent}>
          {REPEAT_OPTIONS.map((item) => {
            const selected = repeat?.repeat.type === item.repeat.type;
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  popoverContent: {
    position: "absolute",
    bottom: "100%",
    right: "100%",
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

export default RepeatMenu;
