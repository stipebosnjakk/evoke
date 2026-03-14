import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { SymbolView } from "expo-symbols";
import { useNavigation, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { format, nextSaturday, nextMonday, addDays, isDate } from "date-fns";

import { setStartDate } from "@/store/tasks/slices/newTask.slice";
import { IsoDate } from "@/types/task.types";
import { toIsoDate } from "@/utils/date";
import { useAppSelector } from "@/hooks/storeHooks";
import Button from "@/components/ui/Button";
import DateInput from "@/components/create/task/DateInput";

const DateModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();

  const startDate = useAppSelector((state) => state.newTask.task.start_date);

  const inputRef = useRef<TextInput>(null);
  const [isDateInputOpen, setIsDateInputOpen] = useState<boolean>(false);

  const today = toIsoDate(new Date());
  const tomorrow = toIsoDate(addDays(new Date(), 1));
  const thisWeekend = toIsoDate(nextSaturday(new Date()));
  const nextWeek = toIsoDate(nextMonday(new Date()));

  useEffect(() => {
    if (!isDateInputOpen) return;
    navigation.setOptions({
      sheetAllowedDetents: [1],
    });
  }, [isDateInputOpen, navigation]);

  const handleUpdateStartDate = (date: IsoDate | null) => {
    dispatch(setStartDate({ start_date: date }));
    router.back();
  };

  const handleGoBack = () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      navigation.setOptions({
        sheetAllowedDetents: "fitToContents",
      });
      setIsDateInputOpen(false);
      return;
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Button iconOnly onPress={handleGoBack}>
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
        <Text style={styles.title}>Date</Text>
        <Button iconOnly onPress={() => {}}>
          <SymbolView
            name="checkmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
      </View>
      <DateInput
        inputRef={inputRef}
        isOpen={isDateInputOpen}
        onFocusChange={setIsDateInputOpen}
        updateDate={handleUpdateStartDate}
        dateValue={startDate}
      />
      {!isDateInputOpen && (
        <View style={styles.shortcutsContainer}>
          {startDate !== today && (
            <Button
              style={styles.button}
              onPress={() => handleUpdateStartDate(today)}
            >
              <View style={styles.ButtonContainer}>
                <View style={styles.iconContainer}>
                  <SymbolView
                    name="clock"
                    weight="medium"
                    size={26}
                    type="monochrome"
                    tintColor="rgba(0, 0, 0, 0.45)"
                  />
                  <Text style={styles.shortcutLabel}>Today</Text>
                </View>
                <Text style={styles.shortcutDay}>
                  {format(new Date(), "EEE")}
                </Text>
              </View>
            </Button>
          )}
          {startDate !== tomorrow && (
            <Button
              style={styles.button}
              onPress={() => {
                handleUpdateStartDate(tomorrow);
              }}
            >
              <View style={styles.ButtonContainer}>
                <View style={styles.iconContainer}>
                  <SymbolView
                    name="sunrise"
                    weight="medium"
                    size={26}
                    type="monochrome"
                    tintColor="rgba(0, 0, 0, 0.45)"
                  />
                  <Text style={styles.shortcutLabel}>Tomorrow</Text>
                </View>
                <Text style={styles.shortcutDay}>
                  {format(addDays(new Date(), 1), "EEE")}
                </Text>
              </View>
            </Button>
          )}
          {startDate !== thisWeekend && (
            <Button
              style={styles.button}
              onPress={() => {
                handleUpdateStartDate(thisWeekend);
              }}
            >
              <View style={styles.ButtonContainer}>
                <View style={styles.iconContainer}>
                  <SymbolView
                    name="beach.umbrella"
                    weight="medium"
                    size={26}
                    type="monochrome"
                    tintColor="rgba(0, 0, 0, 0.45)"
                  />
                  <Text style={styles.shortcutLabel}>This Weekend</Text>
                </View>
                <Text style={styles.shortcutDay}>
                  {format(nextSaturday(new Date()), "EEE")}
                </Text>
              </View>
            </Button>
          )}
          {startDate !== nextWeek && (
            <Button
              style={styles.button}
              onPress={() => {
                handleUpdateStartDate(nextWeek);
              }}
            >
              <View style={styles.ButtonContainer}>
                <View style={styles.iconContainer}>
                  <SymbolView
                    name="chevron.forward.2"
                    weight="medium"
                    size={26}
                    type="monochrome"
                    tintColor="rgba(0, 0, 0, 0.45)"
                  />
                  <Text style={styles.shortcutLabel}>Next Week</Text>
                </View>
                <Text style={styles.shortcutDay}>
                  {format(nextMonday(new Date()), "EEE")}
                </Text>
              </View>
            </Button>
          )}
          <Button style={styles.button} onPress={() => {}}>
            <View style={styles.ButtonContainer}>
              <View style={styles.iconContainer}>
                <SymbolView
                  name="calendar"
                  weight="medium"
                  size={26}
                  type="monochrome"
                  tintColor="rgba(0, 0, 0, 0.45)"
                />
                <Text style={styles.shortcutLabel}>Custom</Text>
              </View>
              <SymbolView
                name="chevron.right"
                weight="medium"
                size={15}
                type="monochrome"
                tintColor="rgba(0, 0, 0, 0.45)"
              />
            </View>
          </Button>
          <Button style={styles.button} onPress={() => {}}>
            <View style={styles.ButtonContainer}>
              <View style={styles.iconContainer}>
                <SymbolView
                  name="clock"
                  weight="medium"
                  size={26}
                  type="monochrome"
                  tintColor="rgba(0, 0, 0, 0.45)"
                />
                <Text style={styles.shortcutLabel}>Time</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>None</Text>
                <SymbolView
                  name="chevron.right"
                  weight="medium"
                  size={15}
                  type="monochrome"
                  tintColor="rgba(0, 0, 0, 0.45)"
                />
              </View>
            </View>
          </Button>
          <Button
            style={styles.button}
            onPress={() => {
              handleUpdateStartDate(null);
            }}
          >
            <View style={styles.noDayShortCutsContainer}>
              <SymbolView
                name="infinity"
                weight="medium"
                size={26}
                type="monochrome"
                tintColor="rgba(0, 0, 0, 0.45)"
              />
              <Text style={styles.shortcutLabel}>No Date</Text>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  shortcutsContainer: {
    flexDirection: "column",
  },
  ButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  shortcutLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 0.45)",
  },
  shortcutDay: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.45)",
  },
  noDayShortCutsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  button: {
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.45)",
  },
});

export default DateModal;
