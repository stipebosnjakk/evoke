import { StyleSheet, Text, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";

import { toIsoDate } from "@/utils/date";
import { IsoDate } from "@/types/task.types";

type CalendarViewType = {
  minDate?: IsoDate | null;
  maxDate?: IsoDate | null;
  selected: IsoDate | null;
  setSelected: (date: IsoDate) => void;
};

const CalendarView = ({
  maxDate,
  minDate,
  selected,
  setSelected,
}: CalendarViewType) => {
  const today = toIsoDate(new Date());

  return (
    <Calendar
      current={selected ? selected : minDate || today}
      minDate={minDate || today}
      maxDate={maxDate || undefined}
      firstDay={1}
      enableSwipeMonths
      disableAllTouchEventsForDisabledDays
      theme={{
        arrowColor: "rgb(67, 67, 67)",
        textSectionTitleColor: "rgba(0,0,0,0.35)",
        textInactiveColor: "rgba(0,0,0,0.35)",
        textDisabledColor: "rgba(0,0,0,0.35)",
        dayTextColor: "rgb(67, 67, 67)",
        monthTextColor: "rgb(67, 67, 67)",
      }}
      markedDates={{
        ...(selected
          ? {
              [selected]: {
                selected: true,
                disableTouchEvent: true,
              },
            }
          : {}),
        ...(minDate && today < minDate
          ? {
              [today]: {
                disabled: true,
                disableTouchEvent: true,
              },
            }
          : {}),
      }}
      dayComponent={({ date, state, marking }) => {
        if (!date) return null;

        const isoDate = date.dateString as IsoDate;
        const isDisabled = state === "disabled" || marking?.disabled === true;
        const isSelected = !isDisabled && selected === isoDate;
        const isPressDisabled =
          isDisabled || marking?.disableTouchEvent === true;

        return (
          <Pressable
            disabled={isPressDisabled}
            onPress={() => setSelected(isoDate)}
            style={[styles.day, isSelected && styles.daySelected]}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.dayTextSelected,
                isDisabled && styles.dayTextDisabled,
              ]}
            >
              {date.day}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  dayText: {
    color: "rgb(67, 67, 67)",
  },
  dayTextDisabled: {
    color: "rgba(0,0,0,0.35)",
  },
  dayTextSelected: {
    color: "black",
  },
});

export default CalendarView;
