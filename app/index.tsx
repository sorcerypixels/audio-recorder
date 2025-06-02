import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
} from "expo-audio";
import * as React from "react";
import { Alert, View } from "react-native";

import { IconButton } from "@/components/button";
import { ErrorAlert } from "@/components/error";
import { LoadingAlert } from "@/components/loading";
import Playback from "@/components/playback";
import RecordBtn from "@/components/recordBtn";
import ScreenProvider from "@/components/ScreenProvider";
import Timer from "@/components/timer";
import { useAsync } from "@/utils/async";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type AudioStatus = "idle" | "recording" | "paused" | "stopped";

export interface AudioState {
  status: AudioStatus;
  uri: string | null;
}
type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "STOP"; uri: string | null }
  | { type: "RESET" };
const initialState: AudioState = { status: "idle", uri: null };

function reducer(state: AudioState, action: Action): AudioState {
  switch (action.type) {
    case "START":
      return { ...state, status: "recording", uri: null };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "RESUME":
      return { ...state, status: "recording" };
    case "STOP":
      return { ...state, status: "stopped", uri: action.uri };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
async function getAudioPermission() {
  const permission = await getRecordingPermissionsAsync();

  if (permission.granted) return true;
  else if (!permission.granted && permission.canAskAgain) {
    const status = await requestRecordingPermissionsAsync();

    if (status.granted) {
      return true;
    }
  }

  throw new Error(
    "Microphone permissions are not granted. Please enable them in your device settings."
  );
}

export default function App() {
  //================================
  // Init
  //================================
  const { loading, error } = useAsync(getAudioPermission, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  //================================
  // Handlers
  //================================
  async function start() {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    dispatch({ type: "START" });
  }
  function pause() {
    audioRecorder.pause();
    dispatch({ type: "PAUSE" });
  }
  function resume() {
    audioRecorder.record();
    dispatch({ type: "RESUME" });
  }
  async function stop() {
    await audioRecorder.stop();
    dispatch({ type: "STOP", uri: audioRecorder.uri });
  }
  function reset() {
    dispatch({ type: "RESET" });
  }
  function onDelete() {
    Alert.alert(
      "Delete confirmation",
      "Are you sure to remove the audio?",
      [
        {
          text: "Delete",
          onPress: reset,
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  //================================
  // Render
  //================================
  if (loading)
    return (
      <ScreenProvider>
        <LoadingAlert className="px-[30px] mt-6" />
      </ScreenProvider>
    );

  if (error)
    return (
      <ScreenProvider>
        <ErrorAlert className="px-[30px] mt-6" error={error} />
      </ScreenProvider>
    );

  return (
    <ScreenProvider>
      <View className="px-[30px] mt-6 items-center">
        <View>
          <RecordBtn
            isRecording={state.status === "recording"}
            isPaused={state.status === "paused"}
            onPress={() => {
              if (state.status === "idle" || state.status === "stopped") {
                start();
              } else if (
                state.status === "recording" ||
                state.status === "paused"
              ) {
                stop();
              }
            }}
          />
        </View>
        <View className="my-2.5">
          <Timer status={state.status} />
        </View>
        {state.status === "recording" || state.status === "paused" ? (
          <View className="mt-4">
            <IconButton
              onPress={() => {
                if (state.status === "recording") {
                  pause();
                } else if (state.status === "paused") {
                  resume();
                }
              }}
              variant="outlined"
              accent="#FF575F"
              focusBgColor="#FF575F22"
              rounded
              size={60}
              icon={
                <MaterialCommunityIcons
                  name={state.status === "recording" ? "pause" : "play-pause"}
                  size={24}
                  color="#FF575F"
                />
              }
            />
          </View>
        ) : null}
        {state.uri ? (
          <View className="w-full">
            <Playback uri={state.uri} onDelete={onDelete} />
          </View>
        ) : null}
      </View>
    </ScreenProvider>
  );
}
