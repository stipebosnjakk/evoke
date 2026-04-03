import { Calendar } from "react-native-calendars";

import { toIsoDate } from "@/utils/date";
import { IsoDate } from "@/types/task.types";

type CalendarViewType = {
  selected: IsoDate | null;
  setSelected: (date: IsoDate) => void;
};

const CalendarView = ({ selected, setSelected }: CalendarViewType) => {
  const today = toIsoDate(new Date());

  return (
    <Calendar
      current={selected || today}
      minDate={today}
      enableSwipeMonths
      theme={{
        arrowColor: "rgb(67, 67, 67)",
        textSectionTitleColor: "rgba(0,0,0,0.35)",
        textInactiveColor: "rgba(0,0,0,0.35)",
        textDisabledColor: "rgba(0,0,0,0.35)",
        selectedDayBackgroundColor: "rgba(0,0,0,0.06)",
        selectedDayTextColor: "rgb(67, 67, 67)",
        todayTextColor: "rgb(67, 67, 67)",
        dayTextColor: "rgb(67, 67, 67)",
      }}
      onDayPress={(day) => {
        setSelected(day.dateString as IsoDate);
      }}
      markedDates={
        selected
          ? {
              [selected]: {
                selected: true,
                disableTouchEvent: true,
              },
            }
          : undefined
      }
    />
  );
};

export default CalendarView;
