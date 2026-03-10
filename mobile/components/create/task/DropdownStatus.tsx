import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import Chip from "../../ui/Chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_STATUSES } from "@/consts/statuses";
import { useAppSelector } from "@/hooks/storeHooks";
import { useDispatch } from "react-redux";
import { setStatus } from "@/store/tasks/slices/newTask.slice";

const DropdownStatus = () => {
  const dispatch = useDispatch();

  const status = useAppSelector((state) => state.newTask.task.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Pressable>
          <Chip
            icon={status ? status.icon : "tag"}
            label={status ? status.label : "Status"}
          />
        </Pressable>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={styles.dropdownContent}>
        {TASK_STATUSES.map((item) => {
          const selected = status?.label === item.label;
          return (
            <DropdownMenuItem
              key={item.label}
              onPress={() => dispatch(setStatus({ status: item }))}
              style={{
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 14,
                backgroundColor: selected ? "rgba(0,0,0,0.12)" : "transparent",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <SymbolView
                  name={item.icon as any}
                  weight="medium"
                  size={18}
                  type="monochrome"
                  tintColor={selected ? "black" : "rgb(67, 67, 67)"}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "rgb(67, 67, 67)",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const styles = StyleSheet.create({
  dropdownContent: {
    width: 240,
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
});

export default DropdownStatus;
