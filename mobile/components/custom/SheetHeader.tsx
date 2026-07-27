import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  submitDisabled,
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
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerSide}>
        <TouchableOpacity onPress={handleClose}>
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View
        style={
          submitButtonVisible ? styles.headerSide : styles.headerPlaceholder
        }
      >
        {submitButtonVisible && (
          <TouchableOpacity
            onPress={onSubmit}
            disabled={submitDisabled || !onSubmit}
            style={{
              opacity: submitDisabled || !onSubmit ? 0.5 : 1,
            }}
          >
            <SymbolView
              name="checkmark"
              weight="medium"
              size={20}
              type="monochrome"
              tintColor="rgb(67, 67, 67)"
            />
          </TouchableOpacity>
        )}
      </View>
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
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 44,
  },
});

export default SheetHeader;
