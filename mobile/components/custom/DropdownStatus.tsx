import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import Chip from "../ui/Chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatusOption } from "@/types/task.types";
import { TASK_STATUSES } from "@/utils/consts";

type DropdownStatusType = {
  status: TaskStatusOption | null;
  setStatus: (status: TaskStatusOption | null) => void;
};

const DropdownStatus = ({ status, setStatus }: DropdownStatusType) => (
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
            onPress={() => setStatus(item)}
            style={{
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 14,
              backgroundColor: selected
                ? "rgba(255,255,255,0.12)"
                : "transparent",
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
                name={item.icon}
                weight="medium"
                size={18}
                type="monochrome"
                tintColor={selected ? "white" : "rgba(255,255,255,0.9)"}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.95)",
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

const styles = StyleSheet.create({
  dropdownContent: {
    width: 240,
    backgroundColor: "rgba(35,35,35,0.98)",
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
