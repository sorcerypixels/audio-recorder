import { darkenHexColor } from "@/utils/color";
import * as React from "react";
import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

const duration = 200;

interface BasicButtonProps extends PressableProps {
  variant?: "solid" | "text" | "outlined";
  loading?: boolean;
  bgColor?: string;
  focusBgColor?: string;
  // indicator color
  accent?: string;
  width?: number;
  shadow?: {
    color: string;
    opacity: number;
  };
}

export function Button({
  variant = "solid",
  bgColor,
  focusBgColor,
  accent = "#fff",
  shadow,
  disabled,
  loading,
  style,
  className,
  onPressIn,
  onPressOut,
  children,
  ...others
}: BasicButtonProps) {
  const regularBg = bgColor ?? "black";
  const focusedBg = focusBgColor
    ? focusBgColor
    : bgColor
    ? darkenHexColor(bgColor, 0.1)
    : "#BEC7C5";
  const isDisabled = disabled ? "opacity-60" : "opacity-100";
  const borderStyles =
    variant === "outlined"
      ? {
          borderColor: accent,
          borderWidth: 2,
        }
      : null;
  const shadowStyle = shadow
    ? {
        shadowColor: shadow.color,
        shadowOpacity: shadow.opacity,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 4,
        elevation: 4,
      }
    : undefined;
  const transition = useSharedValue(0);
  const isActive = useSharedValue(false);
  const animatedBgStyle = useAnimatedStyle(() => {
    if (variant === "solid") {
      return {
        backgroundColor: interpolateColor(
          transition.value,
          [0, 1],
          [regularBg, focusedBg]
        ),
      };
    } else if (variant === "outlined" || variant === "text") {
      return {
        backgroundColor: interpolateColor(
          transition.value,
          [0, 1],
          ["transparent", focusedBg]
        ),
      };
    }
    return {};
  });

  return (
    <Pressable
      {...others}
      style={style}
      className="h-[60px] w-full"
      disabled={disabled || loading}
      onPressIn={(e) => {
        isActive.value = true;
        transition.value = withTiming(
          1,
          { duration, easing: Easing.inOut(Easing.ease) },
          () => {
            if (!isActive.value) {
              transition.value = withTiming(0, {
                duration,
                easing: Easing.inOut(Easing.ease),
              });
            }
          }
        );
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (transition.value === 1) {
          transition.value = withTiming(0, {
            duration,
            easing: Easing.inOut(Easing.ease),
          });
        }
        isActive.value = false;
        onPressOut?.(e);
      }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Press me"
    >
      <Animated.View
        style={[shadowStyle, animatedBgStyle, borderStyles]}
        className={twMerge(
          `justify-center items-center rounded-[12px] h-full w-full`,
          isDisabled,
          className
        )}
      >
        {loading ? (
          <ActivityIndicator color={accent} size={20} />
        ) : (
          (children as React.ReactNode)
        )}
      </Animated.View>
    </Pressable>
  );
}

interface IconButtonProps extends BasicButtonProps {
  icon: React.ReactNode;
  rounded?: boolean;
  size?: number;
}

export function IconButton({
  icon,
  rounded = false,
  size = 60,
  ...others
}: IconButtonProps) {
  const radiusStyles = rounded ? "rounded-[50%]" : undefined;

  return (
    <Button
      {...others}
      className={radiusStyles}
      style={{
        width: size,
        height: size,
      }}
    >
      {icon}
    </Button>
  );
}
