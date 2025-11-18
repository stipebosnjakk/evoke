import { useState } from "react";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols/build/SymbolView";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text as ButtonText } from "@/components/ui/text";

export default function Modal() {
  const isPresented = router.canGoBack();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCloseModal = () => {
    if (isPresented) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select option</Text>
      <View style={styles.optionsContainer}>
        <Pressable
          style={[
            styles.option,
            selectedOption === "task" && {
              backgroundColor: "#FAFAFA",
            },
          ]}
          onPress={() => setSelectedOption("task")}
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: "rgba(59,130,246,0.08)" },
            ]}
          >
            <SymbolView
              name="checkmark"
              size={24}
              tintColor="rgba(59,130,246,1)"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionText}>Task</Text>
            <Text style={styles.optionDescription}>
              A single one-time action you want to complete without repeating.
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[
            styles.option,
            selectedOption === "habit" && {
              backgroundColor: "#FAFAFA",
            },
          ]}
          onPress={() => setSelectedOption("habit")}
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: "rgba(139,92,246,0.08)" },
            ]}
          >
            <SymbolView
              name="repeat"
              size={24}
              tintColor="rgba(139,92,246,1)"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionText}>Habit</Text>
            <Text style={styles.optionDescription}>
              A routine action you repeat daily or weekly to improve long-term
              habits.
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[
            styles.option,
            selectedOption === "goal" && {
              backgroundColor: "#FAFAFA",
            },
          ]}
          onPress={() => setSelectedOption("goal")}
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: "rgba(16,185,129,0.08)" },
            ]}
          >
            <SymbolView name="flag" size={24} tintColor="rgba(16,185,129,1)" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionText}>Goal</Text>
            <Text style={styles.optionDescription}>
              Larger achievement broken into smaller parts.
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.buttonsContainer}>
        <Button disabled={!isPresented || !selectedOption}>
          <ButtonText>Continue</ButtonText>
        </Button>
        <Pressable
          style={styles.closeButton}
          onPress={handleCloseModal}
          disabled={!isPresented}
        >
          <ButtonText style={styles.closeButtonText}>Close</ButtonText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  optionsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 15,
  },
  option: {
    width: "100%",
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
  optionDescription: {
    fontSize: 14,
    color: "gray",
    flexWrap: "wrap",
  },
  optionIcon: {
    padding: 10,
    borderRadius: "50%",
    marginRight: 15,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 30,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  closeButtonText: {
    color: "gray",
    fontSize: 14,
  },
});
