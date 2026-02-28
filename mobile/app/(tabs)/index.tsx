import ScreenContainer from "@/components/custom/ScreenContainer";

import { ScrollView, Dimensions } from "react-native";

const TodayScreen = () => {
  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{
          minHeight: Dimensions.get("window").height * 2,
        }}
      ></ScrollView>
    </ScreenContainer>
  );
};

export default TodayScreen;
