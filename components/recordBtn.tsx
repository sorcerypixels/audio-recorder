import * as React from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  Blur,
  Canvas,
  LinearGradient,
  Path,
  Skia,
} from "@shopify/react-native-skia";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  isRecording: boolean;
  isPaused: boolean;
  onPress(): void;
}

const size = 270;
const padding = 10;
const firstLAyerWidth = 15;
const secondLayerWidth = 15;
const btnRadius = size / 2 - (firstLAyerWidth + secondLayerWidth + padding);
const cx = size / 2;
const cy = size / 2;
const colors = {
  idle: ["#40DF9F", "#3ED598"],
  recording: ["#FF575F", "#FF565E"],
  shades: ["#FF575F60", "#FF575F35"],
};

function RecordBtn({ isRecording, isPaused, onPress }: Props) {
  const firstOp = useSharedValue(0);
  const secondOp = useSharedValue(0);
  const [isFocused, setFocus] = React.useState(false);
  const shades = colors.shades;
  const circlePath = Skia.Path.Make().addCircle(cx, cy, btnRadius);
  const blurPath = Skia.Path.Make().addCircle(cx, cy, btnRadius);
  const firstLayerPath = Skia.Path.Make().addCircle(
    cx,
    cy,
    btnRadius + firstLAyerWidth / 2
  );
  const secondLayerPath = Skia.Path.Make().addCircle(
    cx,
    cy,
    btnRadius + secondLayerWidth + firstLAyerWidth / 2
  );
  const strokeWidth = isFocused ? 10 : 4;

  //================================
  // Handlers
  //================================
  React.useEffect(() => {
    firstOp.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.in(Easing.ease),
      }),
      -1,
      true
    );
    secondOp.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.in(Easing.ease),
      }),
      -1,
      true
    );
  }, [firstOp, secondOp]);

  //================================
  // Subcomponents
  //================================
  const pulses = (
    <>
      <Path
        path={firstLayerPath}
        style={"stroke"}
        color={shades[0]}
        strokeWidth={firstLAyerWidth}
        opacity={firstOp}
      />
      <Path
        path={secondLayerPath}
        style={"stroke"}
        color={shades[1]}
        strokeWidth={secondLayerWidth}
        opacity={secondOp}
      />
    </>
  );
  const shadow = (
    <Path
      path={blurPath}
      style={"stroke"}
      color={isRecording || isPaused ? "#FF575F90" : "#40DF9F90"}
      strokeWidth={strokeWidth}
    >
      <Blur blur={strokeWidth} mode={"clamp"} />
    </Path>
  );

  //================================
  // Render
  //================================
  return (
    <Pressable
      onPressIn={() => setFocus(true)}
      onPressOut={() => setFocus(false)}
      onPress={onPress}
      className="flex items-center relative justify-center w-full h-full rounded-[50%]"
      style={{ width: size, height: size }}
    >
      <Canvas style={[StyleSheet.absoluteFill]}>
        <Path path={circlePath}>
          <LinearGradient
            colors={isRecording || isPaused ? colors.recording : colors.idle}
            start={{
              x: firstLAyerWidth + secondLayerWidth,
              y: firstLAyerWidth + secondLayerWidth,
            }}
            end={{
              x: firstLAyerWidth + secondLayerWidth + btnRadius * 2,
              y: firstLAyerWidth + secondLayerWidth + btnRadius * 2,
            }}
          />
        </Path>
        {isRecording ? pulses : shadow}
      </Canvas>
      <FontAwesome6
        name={isRecording || isPaused ? "stop" : "microphone"}
        size={60}
        color={"white"}
      />
    </Pressable>
  );
}

export default RecordBtn;
