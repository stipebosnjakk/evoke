import { RefObject, useMemo, useState } from "react";
import { View, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";

import { IsoDate } from "@/types/task.types";
import { formatIsoDate, smartDateInput, toIsoDate } from "@/utils/date";
import { format } from "date-fns";

type DateInputType = {
  inputRef: RefObject<TextInput | null>;
  isOpen: boolean;
  onFocusChange: (isFocused: boolean) => void;
  updateDate: (date: IsoDate | null) => void;
  dateValue?: IsoDate | null;
};

type AvailableDateType = {
  isoDate: IsoDate | null;
  uiDate: string | null;
};

const DateInput = ({
  inputRef,
  isOpen,
  onFocusChange,
  updateDate,
  dateValue,
}: DateInputType) => {
  const [dateInput, setDateInput] = useState<string>(
    dateValue ? formatIsoDate(dateValue) : "",
  );

  const [availableDate, setAvailableDate] = useState<AvailableDateType>({
    isoDate: null,
    uiDate: null,
  });

  const handleOnChangeText = (text: string) => {
    setDateInput(text);
    const getSmartInputDateDay = smartDateInput(text);

    if (getSmartInputDateDay) {
      setAvailableDate({
        isoDate: toIsoDate(getSmartInputDateDay),
        uiDate: format(getSmartInputDateDay, "EEEE d MMM"),
      });
      return;
    }

    setAvailableDate({
      isoDate: null,
      uiDate: null,
    });
  };

  const handleTypedDateSubmit = () => {
    const getSmartInputDateDay = smartDateInput(dateInput);
    if (!getSmartInputDateDay) return null;
    updateDate(toIsoDate(getSmartInputDateDay));
  };

  const selectDate = () => {
    if (availableDate.isoDate) {
      updateDate(availableDate.isoDate);
      return;
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={
            isOpen
              ? dateInput
              : dateValue
                ? formatIsoDate(dateValue)
                : dateInput
          }
          onSubmitEditing={handleTypedDateSubmit}
          placeholder="Type a date"
          placeholderTextColor="rgba(0,0,0,0.35)"
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(text) => handleOnChangeText(text)}
          onFocus={() => onFocusChange(true)}
        />
      </View>
      {isOpen && availableDate.isoDate && (
        <Pressable style={styles.dateContainer} onPress={selectDate}>
          <SymbolView
            name="calendar"
            weight="medium"
            size={26}
            type="monochrome"
            tintColor="rgba(0, 0, 0, 0.45)"
          />
          <Text style={styles.dateText}>{availableDate.uiDate}</Text>
        </Pressable>
      )}
      {isOpen && !availableDate.isoDate && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>Try today, tomorrow, or next Friday</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: "rgba(0,0,0,0.06)",
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 10,
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "rgb(240, 240, 240)",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  dateText: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.1,
    color: "black",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 14,
  },
});

export default DateInput;
