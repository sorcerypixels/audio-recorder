import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import thin from "../assets/fonts/SF-Pro-Display-Bold.otf";
import heavy from "../assets/fonts/SF-Pro-Display-Heavy.otf";
import regular from "../assets/fonts/SF-Pro-Display-Regular.otf";
import semibold from "../assets/fonts/SF-Pro-Display-Semibold.otf";
import bold from "../assets/fonts/SF-Pro-Display-Thin.otf";
import "../global.css";

export default function RootLayout() {
  const [fontLoaded, fontErrors] = useFonts({
    thin,
    regular,
    semibold,
    bold,
    heavy,
  });

  if (!fontLoaded && !fontErrors) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
