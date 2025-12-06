import { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";

type SlideTransitionProps = {
  index: number;
  children: React.ReactNode;
};

const SlideTransition = ({ index, children }: SlideTransitionProps) => {
  const { width } = Dimensions.get("window");

  const translateX = useRef(new Animated.Value(0)).current;
  const previousIndex = useRef(index);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousIndex.current = index;
      return;
    }

    const direction = index > previousIndex.current ? 1 : -1;
    translateX.setValue(direction * width);

    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    previousIndex.current = index;
  }, [index]);
  
  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
};

export default SlideTransition;
