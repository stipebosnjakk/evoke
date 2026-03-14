import { useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";

const today = new Date();
const todayId = toDateId(today);
const maxDate = new Date(today);
maxDate.setFullYear(maxDate.getFullYear() + 2);
const maxDateId = toDateId(maxDate);

const CalendarView = () => {
  const { height } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(todayId);
  const activeDateRanges = useMemo(
    () => [{ startId: selectedDate, endId: selectedDate }],
    [selectedDate]
  );

  return (
    <View style={{ width: "100%", height: Math.min(height * 0.72, 560) }}>
      <Calendar.List
        calendarInstanceId="task-date-picker"
        calendarInitialMonthId={todayId}
        calendarMinDateId={todayId}
        calendarMaxDateId={maxDateId}
        calendarActiveDateRanges={activeDateRanges}
        onCalendarDayPress={setSelectedDate}
      />
    </View>
  );
};

export default CalendarView;