import { View, ScrollView, StyleSheet } from "react-native";
import { nextMonday, addDays, isWeekend } from "date-fns";

import Chip from "@/components/custom/Chip";
import { getWeekendSaturday, minDate, toIsoDate } from "@/utils/date";
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
  const nextWeek = toIsoDate(nextMonday(new Date()));
  const nextWeekend = toIsoDate(getWeekendSaturday(today, 1));
  const thisWeekend = isWeekend(today)
    ? null
    : toIsoDate(getWeekendSaturday(today, 0));

  const isStartDateShortcutAvailable = (shortcutDate: IsoDate) => {
    if (selectedStartDate === shortcutDate) return false;
    if (!selectedDeadline) return true;
    const maximumStartDate = minDate("start_date", selectedDeadline);
    if (!maximumStartDate) return true;
    return shortcutDate <= maximumStartDate;
  };

  const isDeadlineShortcutAvailable = (shortcutDate: IsoDate) => {
    if (selectedDeadline === shortcutDate) return false;
    if (!selectedStartDate) return true;
    const minimumDeadline = minDate("deadline", selectedStartDate);
    if (!minimumDeadline) return true;
    return shortcutDate >= minimumDeadline;
  };

  const isShortcutAvailable = (shortcutDate: IsoDate | null) => {
    if (!shortcutDate) return false;
    return type === "deadline"
      ? isDeadlineShortcutAvailable(shortcutDate)
      : isStartDateShortcutAvailable(shortcutDate);
  };

  const shortcuts = [
    {
      key: "today",
      icon: "sun.max",
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
      key: "nextWeekend",
      icon: "moon.stars",
      label: "Next Weekend",
      date: nextWeekend,
      available: isShortcutAvailable(nextWeekend),
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
