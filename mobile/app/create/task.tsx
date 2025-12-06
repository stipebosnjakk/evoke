import { useState } from "react";
import { View, Text } from "react-native";
import ScreenContainer from "@/components/custom/ScreenContainer";
import SliderWrapper from "@/components/create/SliderWrapper";
import TitleAndDesc from "@/components/create/TitleAndDesc";
import SlideTransition from "@/components/custom/SlideTransition";
import QuickDetails from "@/components/create/task/QuickDetails";

const Task = () => {
  const [step, setStep] = useState(0);
  const totalSlides = 2;
  const handleBack = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  };
  const handleContinue = () => {
    if (step === totalSlides - 1) return;
    setStep((prev) => prev + 1);
  };
  const renderSlide = () => {
    if (step === 0) return <TitleAndDesc />;
    return (
      <View>
        <Text>Second slide</Text>
      </View>
    );
  };
  return (
    <ScreenContainer>
      <SliderWrapper
        totalSlides={totalSlides}
        currentSlide={step}
        onBack={handleBack}
        onContinue={handleContinue}
      >
        <SlideTransition index={step}>{renderSlide()}</SlideTransition>
      </SliderWrapper>
    </ScreenContainer>
  );
};

export default Task;
