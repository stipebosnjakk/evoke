import { useState } from "react";
import { View, Text } from "react-native";

const DeadlineModal = () => {
  const [deadline, setDeadline] = useState<number | null>(null);
  return (
    <View>
      <Text>DeadlineModal</Text>
    </View>
  );
};

export default DeadlineModal;
