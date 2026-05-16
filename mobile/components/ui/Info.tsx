import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SymbolView } from "expo-symbols";

type InfoType = {
  text: string;
};

const Info = ({ text }: InfoType) => {
  return (
    <View style={styles.infoBox}>
      <SymbolView
        name="info.circle"
        weight="regular"
        size={15}
        type="monochrome"
        tintColor="rgb(90, 90, 90)"
      />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    marginTop: 12,
    backgroundColor: "rgb(245, 245, 245)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "rgb(90, 90, 90)",
  },
});

export default Info;
