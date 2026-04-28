import { ScrollView, Dimensions } from "react-native";

import ScreenContainer from "@/components/custom/ScreenContainer";

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
