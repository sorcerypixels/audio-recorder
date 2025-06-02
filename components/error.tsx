import * as React from "react";
import { Text, View } from "react-native";

interface Props {
  error: Error;
  className?: string;
}

export function ErrorAlert({ error, className }: Props) {
  return (
    <View className={className}>
      <Text className="text-meadow-1000 dark:text-white text-[20px] font-bold leading-[30px] font-regular mb-2">
        {error.name}
      </Text>
      <Text className="text-meadow-1000 dark:text-white text-[14px] leading-[20px] font-regular">
        {error.message}
      </Text>
    </View>
  );
}
