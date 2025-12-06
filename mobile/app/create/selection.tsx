import { useState } from "react";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols/build/SymbolView";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColorTheme } from "@/hooks/useColorTheme";
import { ColorTheme } from "@/types/theme";
import { CreateType } from "@/types/create-types";
import ScreenContainer from "@/components/custom/ScreenContainer";

type CreateOption = {
  type: CreateType;
  label: string;
  iconName: SymbolName;
};

const CREATE_OPTIONS: CreateOption[] = [
  { type: "task", label: "Task", iconName: "list.bullet" },
  { type: "habit", label: "Habit", iconName: "repeat" },
  { type: "goal", label: "Goal", iconName: "flag" },
];

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];

type CardWrapperProps = {
  label: string;
  iconName: SymbolName;
  isSelected: boolean;
  onPress: () => void;
  colors: ColorTheme;
};

const CreateSlider = () => {
  const isPresented = router.canGoBack();
  const [selectedOption, setSelectedOption] = useState<CreateType | null>(null);

  const { colors } = useColorTheme();

  const handleCloseSlider = () => {
    if (isPresented) {
      router.back();
    }
  };

  const handleSelectOption = (option: CreateType) => {
    setSelectedOption(option);
  };

  const handleContinueButton = () => {
    if (selectedOption) {
      router.push(`/create/${selectedOption}`);
    }
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          What do you want to create?
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Choose an item type to set things up.
        </Text>
        <View className="w-full mt-6 gap-4">
          {CREATE_OPTIONS.map((option) => (
            <CardWrapper
              key={option.type}
              onPress={() => handleSelectOption(option.type)}
              isSelected={selectedOption === option.type}
              label={option.label}
              iconName={option.iconName}
              colors={colors}
            />
          ))}
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
          onPress={handleContinueButton}
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
    </ScreenContainer>
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

export default CreateSlider;
