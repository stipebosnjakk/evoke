import { useState } from "react";
import { View, Text } from "react-native";

const DeadlineFormSheet = () => {
  const [deadline, setDeadline] = useState<number | null>(null);

  return (
    <View>
      <Text>DeadlineFormSheet</Text>
    </View>
  );
};

export default DeadlineFormSheet;
