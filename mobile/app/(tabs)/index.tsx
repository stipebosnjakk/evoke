import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";

const TodayScreen = () => {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          minHeight: Dimensions.get("window").height * 2,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 16,
          }}
        >
          <Text>Some random text</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" },
});

export default TodayScreen;
