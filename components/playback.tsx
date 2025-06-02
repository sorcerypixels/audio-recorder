import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as React from "react";
import { Pressable, Text, View } from "react-native";

import { IconButton } from "@/components/button";
import Card from "@/components/card";
import { formatSeconds } from "@/utils/time";

// Simulated waveform values
const waveformHeights = [
  21, 45, 18, 45, 21, 47, 38, 13, 16, 35, 34, 12, 55, 16, 25, 27, 58, 50, 17,
  22, 35, 32, 24, 24, 44, 51, 21, 60, 19, 34,
];

const PLAYBACK_RATES = [0.5, 1, 2];

interface Props {
  uri: string;
  onDelete?: () => void;
}

function Playback({ uri, onDelete }: Props) {
  //================================
  // Init
  //================================
  const player = useAudioPlayer(uri);
  const { playbackState, playing, currentTime } = useAudioPlayerStatus(player);
  const [rateIndex, setRateIndex] = React.useState(1); // default to 1x
  const duration = React.useMemo(
    () => formatSeconds(Math.ceil(player.duration)),
    [player.duration]
  );
  const progress = React.useMemo(() => {
    if (currentTime === 0 || player.duration === 0) return null;
    return currentTime / player.duration || 1;
  }, [currentTime, player.duration]);

  //================================
  // Handlers
  //================================
  const togglePlayback = async () => {
    if (playbackState === "ready") {
      if (playing) {
        player.pause();
      } else {
        player.play();
      }
    }
    // repeat
    else if (playbackState === "ended") {
      player.seekTo(0);
    }
  };
  const onRateChange = () => {
    const next = (rateIndex + 1) % PLAYBACK_RATES.length;
    setRateIndex(next);
    player.setPlaybackRate(PLAYBACK_RATES[next]);
  };

  //================================
  // Render
  //================================
  return (
    <Card className="p-6 w-full" title="Playback">
      <View className="mt-6 flex-row flex-nowrap gap-x-4 items-end">
        <IconButton
          size={50}
          accent="#3DD598"
          rounded
          variant="outlined"
          focusBgColor="#D4F5E9"
          onPress={togglePlayback}
          icon={
            <FontAwesome6
              name={player.playing ? "pause" : "play"}
              size={18}
              color="#3DD598"
            />
          }
        />
        <MemoWaveForm progress={progress} />
        <Text className="text-[14px] text-gray-200 dark:text-gray-300">
          {duration}
        </Text>
      </View>
      <View className="flex-row justify-between mt-2 items-center">
        <View>
          <Pressable onPress={onRateChange}>
            <Text className="text-[14px] text-meadow-300 font-regular">
              {`Bit Rate: ${PLAYBACK_RATES[rateIndex]}x`}
            </Text>
          </Pressable>
        </View>
        <View>
          <IconButton
            size={40}
            rounded
            variant="text"
            focusBgColor="#FFE5E7"
            onPress={onDelete}
            icon={<FontAwesome6 name={"trash-can"} size={20} color="#FF575F" />}
          />
        </View>
      </View>
      <View className="mt-2">
        <Text className="text-[12px] font-light text-gray-200 dark:text-gray-300">
          {
            "Note: The waveform displayed in this component is randomly generated as SDK 53 does not provide an API for retrieving amplitude or similar audio data"
          }
        </Text>
      </View>
    </Card>
  );
}

interface WaveFormProps {
  progress: number | null;
}
function WaveForm({ progress }: WaveFormProps) {
  const totalBars = waveformHeights.length;
  return (
    <View className="flex-row flex-1 items-end h-[50px] overflow-hidden gap-x-1">
      {waveformHeights.map((height, index) => {
        const isActive =
          progress === null ? false : index / totalBars <= progress;

        return (
          <View
            key={index}
            className={"flex-grow"}
            style={{
              backgroundColor: isActive ? "#3DD598" : "#D3D3D3",
              height,
            }}
          />
        );
      })}
    </View>
  );
}
const MemoWaveForm = React.memo(WaveForm);

export default Playback;
