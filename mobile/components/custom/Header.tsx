import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "react-native-easing-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

import IconButton from "@/components/ui/IconButton";

type HeaderProps = { title: string };

const Header = ({ title }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;

  const router = useRouter();

  const { colors, locations } = easeGradient({
    colorStops: {
      1: { color: "transparent" },
      0: { color: "rgba(255,255,255, 0.99)" },
      0.5: { color: "white" },
    },
  });

  const openQuickAddModal = () => {
    router.push("/quick-add");
  };

  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerH + 60,
          zIndex: 10,
        }}
      >
        <MaskedView
          style={[StyleSheet.absoluteFill]}
          maskElement={
            <LinearGradient
              locations={locations as any}
              colors={colors as any}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <LinearGradient
            colors={["white", "rgba(255, 255, 255,0.2)"]}
            style={StyleSheet.absoluteFill}
          />
          <BlurView
            intensity={15}
            tint={"light"}
            style={[StyleSheet.absoluteFill]}
          />
        </MaskedView>
      </View>
      <View
        style={[
          styles.row,
          styles.container,
          { height: headerH, paddingTop: insets.top },
        ]}
      >
        <View style={styles.left}>
          <IconButton onPress={() => {}} style={styles.alignStart}>
            <SymbolView
              name="magnifyingglass"
              size={22}
              type="monochrome"
              tintColor="#111827"
            />
          </IconButton>
        </View>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.right}>
          <View style={styles.rightActions}>
            <IconButton onPress={openQuickAddModal} style={styles.iconBtnMr}>
              <SymbolView
                name="bolt.fill"
                size={22}
                type="monochrome"
                tintColor="#111827"
              />
            </IconButton>
            <IconButton onPress={() => {}} style={styles.alignEnd}>
              <SymbolView
                name="plus"
                size={22}
                type="monochrome"
                tintColor="#111827"
              />
            </IconButton>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  row: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  left: {
    flex: 1,
    alignItems: "flex-start",
  },
  center: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  iconBtnMr: {
    marginRight: 8,
  },
  alignStart: {
    alignSelf: "flex-start",
  },
  alignEnd: {
    alignSelf: "flex-end",
  },
});

export default Header;
