import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { SymbolView } from "expo-symbols/build/SymbolView";
import { useColorTheme } from "@/hooks/useColorTheme";

type SliderWrapperProps = {
  totalSlides: number | null;
  currentSlide: number;
  onBack: () => void;
  onContinue: () => void;
  isContinueDisabled?: boolean;
  backLabel?: string;
  continueLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const SliderWrapper = ({
  totalSlides,
  currentSlide,
  onBack,
  onContinue,
  isContinueDisabled = false,
  backLabel = "Back",
  continueLabel = "Continue",
  containerStyle,
  children,
}: SliderWrapperProps) => {
  const { colors } = useColorTheme();

  const handleContinue = () => {
    if (!isContinueDisabled) onContinue();
  };

  const showDots = totalSlides && totalSlides > 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.contentContainer, containerStyle]}>{children}</View>
      <View
        style={[styles.bottomContainer, { backgroundColor: colors.background }]}
      >
        {showDots && (
          <View style={styles.dotsContainer}>
            {Array.from({ length: totalSlides }).map((_, index) => {
              const isActive = index === currentSlide;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isActive ? colors.primary : colors.muted,
                      opacity: isActive ? 1 : 0.4,
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
        <View style={styles.buttonsRow}>
          <Pressable
            onPress={onBack}
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
              {backLabel}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleContinue}
            disabled={isContinueDisabled}
            className="w-[48%] flex-row items-center justify-center px-6 py-3 rounded-full"
            style={{
              backgroundColor: isContinueDisabled
                ? colors.muted
                : colors.primary,
            }}
          >
            <Text
              className="text-base font-medium mr-1"
              style={{ color: colors.background }}
            >
              {continueLabel}
            </Text>
            <SymbolView
              name="chevron.right"
              size={16}
              tintColor={colors.background}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SliderWrapper;
