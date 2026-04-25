import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import { format } from "date-fns";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from "react-redux";
import { useCalendars } from "expo-localization";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "@/components/ui/Button";
import { setTime as setTimeSlice } from "@/store/tasks/slices/newTask.slice";
import {
  getDurationMin,
  getDurationFromDurationMin,
  getHoursAndMinutesFromMin,
  getStartTimeMin,
} from "@/utils/date";
import { useAppSelector } from "@/hooks/storeHooks";

const TimeFormSheet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const calendars = useCalendars();
  const is24Hour = calendars[0]?.uses24hourClock ?? false;
  const timeFormat = is24Hour ? "HH:mm" : "h:mm a";

  const startTimeMin = useAppSelector(
    (state) => state.newTask.task.start_time_min,
  );
  const durationMin = useAppSelector(
    (state) => state.newTask.task.duration_min,
  );

  const startTime = getHoursAndMinutesFromMin(startTimeMin ?? null);
  const duration = getDurationFromDurationMin(durationMin ?? null);

  const [time, setTime] = useState(
    startTime
      ? new Date(0, 0, 0, startTime.hours, startTime.minutes)
      : new Date(),
  );
  const [durationHours, setDurationHours] = useState<number>(
    duration?.hours ?? 0,
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    duration?.minutes ?? 0,
  );

  const durationLabel = useMemo(() => {
    return `${durationHours}:${String(durationMinutes).padStart(2, "0")}`;
  }, [durationHours, durationMinutes]);

  const endTime = useMemo(() => {
    const totalMinutes = durationHours * 60 + durationMinutes;
    return new Date(time.getTime() + totalMinutes * 60 * 1000);
  }, [time, durationHours, durationMinutes]);

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i * 5);
  }, []);

  const handleTimeChange = (_: unknown, selectedTime?: Date) => {
    if (!selectedTime) return;
    setTime(selectedTime);
  };

  const handleSubmitTime = () => {
    const start_time_min = getStartTimeMin(time);
    const duration_min = getDurationMin(durationHours, durationMinutes);

    dispatch(setTimeSlice({ start_time_min, duration_min }));

    router.back();
  };

  const handleRemoveTime = () => {
    dispatch(setTimeSlice({ start_time_min: null, duration_min: null }));
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Button
          iconOnly
          onPress={() => {
            router.back();
          }}
        >
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
        <Text style={styles.title}>Time</Text>
        <Button iconOnly onPress={handleSubmitTime}>
          <SymbolView
            name="checkmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
      </View>
      <View
        style={[styles.row, { paddingVertical: 20, paddingHorizontal: 16 }]}
      >
        <Text style={styles.label}>Time</Text>
        {durationHours > 0 || durationMinutes > 0 ? (
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{format(time, timeFormat)}</Text>
            </View>
            <Text>-</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {format(endTime, timeFormat)}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{format(time, timeFormat)}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={[styles.row, { paddingBottom: 8 }]}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{format(time, timeFormat)}</Text>
            </View>
          </View>
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
              themeVariant="light"
              textColor="#111111"
              style={styles.picker}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={[styles.row, { paddingBottom: 8 }]}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{durationLabel}</Text>
            </View>
          </View>
          <View style={styles.durationPickers}>
            <Picker
              selectedValue={durationHours}
              onValueChange={setDurationHours}
              style={styles.wheel}
              itemStyle={styles.item}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <Picker.Item
                  key={i}
                  label={`${i} h`}
                  value={i}
                  color="#111111"
                />
              ))}
            </Picker>
            <Picker
              selectedValue={durationMinutes}
              onValueChange={setDurationMinutes}
              style={styles.wheel}
              itemStyle={styles.item}
            >
              {minuteOptions.map((minute) => (
                <Picker.Item
                  key={minute}
                  label={`${minute} m`}
                  value={minute}
                  color="#111111"
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      {startTimeMin && (
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleRemoveTime}>
            <Text style={styles.buttonText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardContainer: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: "#F3F3F3",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E3E3E3",
  },
  label: {
    fontSize: 18,
    color: "#111111",
    fontWeight: "400",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgb(67, 67, 67)",
  },
  pickerWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    height: 160,
    overflow: "hidden",
  },
  picker: {
    width: Platform.OS === "ios" ? 320 : "100%",
    height: 160,
  },
  durationPickers: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 180,
  },
  wheel: {
    flex: 1,
  },
  item: {
    fontSize: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 200,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#DC2626",
  },
});

export default TimeFormSheet;
