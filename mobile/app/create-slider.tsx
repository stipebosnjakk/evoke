import { useState } from "react";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols/build/SymbolView";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorTheme } from "@/hooks/useColorTheme";
import { ColorTheme } from "@/app/types/theme";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];

type CardWrapperProps = {
  label: string;
  iconName: SymbolName;
  isSelected: boolean;
  onPress: () => void;
  colors: ColorTheme;
};

const Slider = () => {
  const isPresented = router.canGoBack();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { colors } = useColorTheme();

  const handleCloseSlider = () => {
    if (isPresented) {
      router.back();
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          What do you want to create?
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Choose an item type to set things up.
        </Text>
        <View className="w-full mt-6 gap-4">
          <CardWrapper
            onPress={() => handleSelectOption("task")}
            isSelected={selectedOption === "task"}
            label="Task"
            iconName="list.bullet"
            colors={colors}
          />
          <CardWrapper
            onPress={() => handleSelectOption("habit")}
            isSelected={selectedOption === "habit"}
            label="Habit"
            iconName="repeat"
            colors={colors}
          />
          <CardWrapper
            onPress={() => handleSelectOption("goal")}
            isSelected={selectedOption === "goal"}
            label="Goal"
            iconName="flag"
            colors={colors}
          />
        </View>
      </View>
      <View
        className="w-full flex-row justify-between px-4 mt-8 mb-6"
        style={{ backgroundColor: colors.background }}
      >
        <Pressable
          onPress={handleCloseSlider}
          className="w-[48%] flex-row items-center justify-center px-5 py-3 rounded-full border"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        >
          <SymbolView name="chevron.left" size={16} tintColor={colors.text} />
          <Text
            className="text-base font-medium ml-1"
            style={{ color: colors.text }}
          >
            Back
          </Text>
        </Pressable>
        <Pressable
          disabled={!selectedOption}
          onPress={() => console.log("Continue")}
          className="w-[48%] flex-row items-center justify-center px-6 py-3 rounded-full"
          style={{
            backgroundColor: selectedOption ? colors.primary : colors.muted,
          }}
        >
          <Text
            className="text-base font-medium mr-1"
            style={{ color: colors.background }}
          >
            Continue
          </Text>
          <SymbolView
            name="chevron.right"
            size={16}
            tintColor={colors.background}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const CardWrapper = ({
  label,
  iconName,
  isSelected,
  onPress,
  colors,
}: CardWrapperProps) => (
  <Pressable
    onPress={onPress}
    className="w-full rounded-full border flex-row items-center justify-between px-4 py-3 shadow-sm"
    style={[
      {
        backgroundColor: isSelected ? colors.card : colors.background,
        borderColor: isSelected ? colors.primary : colors.border,
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      { shadowColor: colors.shadow },
    ]}
  >
    <View className="flex-row items-center gap-3">
      <View
        className="h-8 w-8 rounded-xl items-center justify-center"
        style={{
          backgroundColor: isSelected ? colors.border : colors.nav,
        }}
      >
        <SymbolView
          name={iconName}
          size={18}
          tintColor={isSelected ? colors.primary : colors.secondary}
        />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: isSelected ? colors.primary : colors.text,
        }}
      >
        {label}
      </Text>
    </View>

    {isSelected && (
      <SymbolView
        name="checkmark.circle.fill"
        size={20}
        tintColor={colors.primary}
      />
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Slider;
