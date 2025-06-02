import { useColorScheme } from "nativewind";
import * as React from "react";
import { Text, View, type ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props extends ViewProps {
  title?: string;
}

function Card({
  children,
  className,
  title,
  style,
  ...others
}: React.PropsWithChildren<Props>) {
  const { colorScheme } = useColorScheme();
  return (
    <View
      className={twMerge(
        "rounded-[25px] bg-white dark:bg-gray-700 dark:border-0",
        className
      )}
      style={[
        {
          shadowColor: colorScheme === "dark" ? "#19282F" : "#B9B9B9",
          shadowOpacity: 1,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 14,
          elevation: 14,
        },
        style,
      ]}
      {...others}
    >
      {title ? (
        <Text className="text-meadow-1000 dark:text-white text-[18px] font-bold">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export default Card;
