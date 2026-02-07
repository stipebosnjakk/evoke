import ScreenContainer from "@/components/custom/ScreenContainer";

import { View, Text, ScrollView, Dimensions } from "react-native";

const TodayScreen = () => {
  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
};

export default TodayScreen;
