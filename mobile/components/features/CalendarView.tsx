import { StyleSheet, Text, Pressable, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import type {
  DateData,
  DayState,
  MarkedDates,
} from "react-native-calendars/src/types";
import type { MarkingProps } from "react-native-calendars/src/calendar/day/marking";

import { toIsoDate } from "@/utils/date";
import { IsoDate } from "@/types/task.types";
import { SymbolView } from "expo-symbols";
import { CALENDAR_THEME } from "@/lib/theme";

type CalendarViewType = {
  minDate?: IsoDate | null;
  maxDate?: IsoDate | null;
  selected: IsoDate | null;
  setSelected: (date: IsoDate) => void;
};

type DayComponentProps = {
  date?: DateData;
  state?: DayState;
  marking?: MarkingProps;
};

const CalendarView = ({
  maxDate,
  minDate,
  selected,
  setSelected,
}: CalendarViewType) => {
  const today = toIsoDate(new Date());

  const markedDates: MarkedDates = {};

  if (selected) {
    markedDates[selected] = {
      selected: true,
      disableTouchEvent: true,
    };
  }

  if (minDate && today < minDate) {
    markedDates[today] = {
      disabled: true,
      disableTouchEvent: true,
    };
  }

  const renderHeader = (date: any) => {
    const jsDate = date?.toDate?.() ?? new Date();
    return (
      <Text style={styles.headerTitle}>{format(jsDate, "MMMM yyyy")}</Text>
    );
  };

  const renderArrow = (direction: "left" | "right") => (
    <View style={styles.arrowButton}>
      <SymbolView
        name={direction === "left" ? "chevron.left" : "chevron.right"}
        size={12}
        weight="bold"
        tintColor="#2C2C2C"
      />
    </View>
  );

  const DayComponent = ({ date, state, marking }: DayComponentProps) => {
    if (!date) return null;

    const isoDate = date.dateString as IsoDate;
    const isDisabled = state === "disabled" || marking?.disabled === true;
    const isSelected = !isDisabled && selected === isoDate;
    const isPressDisabled = isDisabled || marking?.disableTouchEvent === true;

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
  };

  return (
    <Calendar
      current={selected ? selected : minDate || today}
      minDate={minDate || today}
      maxDate={maxDate || undefined}
      firstDay={1}
      hideExtraDays={false}
      enableSwipeMonths
      disableAllTouchEventsForDisabledDays
      renderArrow={renderArrow}
      renderHeader={renderHeader}
      theme={CALENDAR_THEME}
      markedDates={markedDates}
      dayComponent={DayComponent}
    />
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: "#F1F1F1",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111111",
  },
  dayTextSelected: {
    color: "#111111",
    fontWeight: "500",
  },
  dayTextDisabled: {
    color: "#D0D0D0",
  },
});

export default CalendarView;
