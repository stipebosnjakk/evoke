import { View, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { easeGradient } from "react-native-easing-gradient";

type HeaderWrapperType = {
  children: React.ReactNode;
};

const HeaderWrapper = ({ children }: HeaderWrapperType) => {
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;

  const { colors, locations } = easeGradient({
    colorStops: {
      0.55: { color: "white" },
      1: { color: "transparent" },
    },
  });

  return (
    <>
      <View
        pointerEvents="none"
        style={[styles.blurContainer, { height: headerH + 40 }]}
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
        style={[styles.container, { height: headerH, paddingTop: insets.top }]}
      >
        {children}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
});

export default HeaderWrapper;
