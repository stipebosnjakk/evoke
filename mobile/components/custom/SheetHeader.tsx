import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

type SheetHeaderProps = {
  title: string;
  submitButtonVisible?: boolean;
  submitDisabled?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
};

const SheetHeader = ({
  title,
  onSubmit,
  onClose,
  submitDisabled = false,
  submitButtonVisible = false,
}: SheetHeaderProps) => {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.back();
  };

  const isSubmitDisabled = submitDisabled || !onSubmit;

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.headerSide}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <SymbolView
          name="xmark"
          weight="medium"
          size={20}
          type="monochrome"
          tintColor="rgb(67, 67, 67)"
        />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {submitButtonVisible ? (
        <TouchableOpacity
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          style={[
            styles.headerSide,
            isSubmitDisabled && styles.submitButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save"
          accessibilityState={{ disabled: isSubmitDisabled }}
        >
          <SymbolView
            name="checkmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerSide: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 44,
    height: 44,
  },
});

export default SheetHeader;
