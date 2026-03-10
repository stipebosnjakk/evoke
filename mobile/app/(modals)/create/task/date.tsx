import { View, StyleSheet, TextInput, Text } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";

const DateModal = () => {
  const router = useRouter();

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
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a date"
          placeholderTextColor="rgba(0,0,0,0.35)"
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="twitter"
          style={styles.input}
        />
      </View>
      <View style={styles.shortcutsContainer}>
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
              <Text style={styles.shortcutLabel}>Today</Text>
            </View>
            <Text style={styles.shortcutDay}>Wed</Text>
          </View>
        </Button>
        <Button style={styles.button} onPress={() => {}}>
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
            <Text style={styles.shortcutDay}>Thu</Text>
          </View>
        </Button>
        <Button style={styles.button} onPress={() => {}}>
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
            <Text style={styles.shortcutDay}>Sat</Text>
          </View>
        </Button>
        <Button style={styles.button} onPress={() => {}}>
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
            <Text style={styles.shortcutDay}>Mon</Text>
          </View>
        </Button>
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
        <Button style={styles.button} onPress={() => {}}>
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
  inputContainer: {
    borderBottomColor: "rgba(0,0,0,0.06)",
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 10,
    padding: 12,
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
    fontWeight: "800",
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
