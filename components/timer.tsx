import * as React from "react";
import { Text } from "react-native";

import { AudioState } from "@/app";
import { formatSeconds } from "@/utils/time";

interface Props {
  status: AudioState["status"];
}

function Timer({ status }: Props) {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  //================================
  // Handlers
  //================================
  function startTimer() {
    timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
  }
  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  React.useEffect(() => {
    if (status === "recording") {
      startTimer();
    } else if (status === "paused") {
      stopTimer();
    } else if (status === "idle" || status === "stopped") {
      stopTimer();
      setTime(0);
    }
  }, [status]);
  // cleanup
  React.useEffect(() => () => stopTimer(), []);

  //================================
  // Render
  //================================
  return (
    <Text className="text-center text-meadow-1000 dark:text-white font-bold text-[36px] leading-[48px]">
      {formatSeconds(time)}
    </Text>
  );
}

export default Timer;
