import { useEffect } from "react";
import { router } from "expo-router";

export default function CreateScreen() {
  useEffect(() => {
    router.replace("/create-slider");
  }, []);

  return null;
}
