import { useColorScheme } from "nativewind";
import * as React from "react";
import { Button, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  hide?: boolean;
  bg?: string;
}

function ScreenProvider({
  children,
  bg,
  hide = false,
}: React.PropsWithChildren<Props>) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const fallbackBg = colorScheme === "light" ? "#ffffff" : "#22343C";

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-[#22343C]"
      style={{ backgroundColor: bg ?? fallbackBg }}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
        backgroundColor={bg ?? fallbackBg}
      />
      {hide ? null : (
        <View className="py-3 px-[30px] items-center justify-start flex-row gap-3 border-b-[1px] border-gray-300 dark:border-gray-200">
          <View className="flex-grow-0 flex-shrink-0 gap-x-1 flex-row flex-nowrap">
            <Button
              onPress={toggleColorScheme}
              title={"Theme"}
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}

export default ScreenProvider;
