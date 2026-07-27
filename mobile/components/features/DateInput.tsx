import { RefObject, useState } from "react";
import { View, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import { format } from "date-fns";

import { IsoDate } from "@/types/task.types";
import { useAppSelector } from "@/hooks/storeHooks";
import { smartDateInput } from "@/utils/smartTextInput";
import { formatIsoDate, formatSmartUiDate, toIsoDate } from "@/utils/date";

type DateInputType = {
  inputRef: RefObject<TextInput | null>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleNewDateSelect: (date: IsoDate | null) => void;
  dateValue?: IsoDate | null;
  type: "start" | "deadline";
};

type AvailableDateType = {
  isoDate: IsoDate | null;
  uiDate: string | null;
};

const DateInput = ({
  inputRef,
  isOpen,
  setIsOpen,
  handleNewDateSelect,
  dateValue,
  type,
}: DateInputType) => {
  const startDateValue = useAppSelector(
    (state) => state.formTask.task.start_date,
  );
  const deadlineValue = useAppSelector((state) => state.formTask.task.deadline);

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

    if (!getSmartInputDateDay) {
      setAvailableDate({
        isoDate: null,
        uiDate: null,
      });
      return;
    }

    const typedIso = format(getSmartInputDateDay, "yyyy-MM-dd");

    if (type === "start" && deadlineValue && typedIso >= deadlineValue) {
      setAvailableDate({
        isoDate: null,
        uiDate: null,
      });
      return;
    }

    if (type === "deadline" && startDateValue && typedIso <= startDateValue) {
      setAvailableDate({
        isoDate: null,
        uiDate: null,
      });
      return;
    }

    setAvailableDate({
      isoDate: typedIso as IsoDate,
      uiDate: formatSmartUiDate(getSmartInputDateDay),
    });
  };

  const handleTypedDateSubmit = () => {
    const getSmartInputDateDay = smartDateInput(dateInput);
    if (!getSmartInputDateDay) return null;
    handleNewDateSelect(toIsoDate(getSmartInputDateDay));
  };

  const selectDate = () => {
    if (availableDate.isoDate) {
      handleNewDateSelect(availableDate.isoDate);
      return;
    }
  };

  return (
    <View>
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
          placeholderTextColor="#a5a5a5"
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(text) => handleOnChangeText(text)}
          onFocus={() => setIsOpen(true)}
        />
      </View>
      {isOpen && availableDate.isoDate && (
        <Pressable style={styles.dateContainer} onPress={selectDate}>
          <SymbolView
            name="calendar"
            weight="medium"
            size={26}
            type="monochrome"
            tintColor="#8c8c8c"
          />
          <Text style={styles.dateText}>{availableDate.uiDate}</Text>
        </Pressable>
      )}
      {isOpen && !availableDate.isoDate && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>Try today, tomorrow, or next Friday</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: "#efefef",
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
    borderColor: "#efefef",
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
    color: "#7f7f7f",
    fontSize: 14,
  },
});

export default DateInput;
