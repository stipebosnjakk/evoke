import { View, ScrollView, StyleSheet } from "react-native";
import { nextMonday, addDays, nextSaturday } from "date-fns";

import Chip from "@/components/ui/Chip";
import { minDate, toIsoDate } from "@/utils/date";
import { IsoDate } from "@/types/task.types";

type ShortcutsType = {
  type: "deadline" | "start_date";
  selectedStartDate: IsoDate | null;
  selectedDeadline: IsoDate | null;
  handleNewDateSelect: (date: IsoDate | null) => void;
};

const Shortcuts = ({
  type,
  selectedStartDate,
  selectedDeadline,
  handleNewDateSelect,
}: ShortcutsType) => {
  const today = toIsoDate(new Date());
  const tomorrow = toIsoDate(addDays(new Date(), 1));
  const thisWeekend = toIsoDate(nextSaturday(new Date()));
  const nextWeek = toIsoDate(nextMonday(new Date()));

  const isStartDateShortcutAvailable = (shortcutDate: IsoDate) => {
    if (selectedStartDate === shortcutDate) return false;
    if (!selectedDeadline) return true;
    const minimumDeadline = minDate(shortcutDate);
    if (!minimumDeadline) return true;
    return selectedDeadline >= minimumDeadline;
  };

  const isDeadlineShortcutAvailable = (shortcutDate: IsoDate) => {
    if (selectedDeadline === shortcutDate) return false;
    if (!selectedStartDate) return true;
    const minimumDeadline = minDate(selectedStartDate);
    if (!minimumDeadline) return true;
    return shortcutDate >= minimumDeadline;
  };

  const isShortcutAvailable = (shortcutDate: IsoDate) => {
    return type === "deadline"
      ? isDeadlineShortcutAvailable(shortcutDate)
      : isStartDateShortcutAvailable(shortcutDate);
  };

  const shortcuts = [
    {
      key: "today",
      icon: "clock",
      label: "Today",
      date: today,
      available: isShortcutAvailable(today),
    },
    {
      key: "tomorrow",
      icon: "sunrise",
      label: "Tomorrow",
      date: tomorrow,
      available: isShortcutAvailable(tomorrow),
    },
    {
      key: "thisWeekend",
      icon: "beach.umbrella",
      label: "This Weekend",
      date: thisWeekend,
      available: isShortcutAvailable(thisWeekend),
    },
    {
      key: "nextWeek",
      icon: "chevron.forward.2",
      label: "Next Week",
      date: nextWeek,
      available: isShortcutAvailable(nextWeek),
    },
  ];

  const availableShortcuts = shortcuts.filter((shortcut) => shortcut.available);

  if (availableShortcuts.length === 0) return null;

  return (
    <View collapsable={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.row}>
          {availableShortcuts.map((shortcut) => (
            <Chip
              key={shortcut.key}
              icon={shortcut.icon}
              label={shortcut.label}
              onPress={() => handleNewDateSelect(shortcut.date)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});

export default Shortcuts;
