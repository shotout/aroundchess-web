export function createCountdown(
  initialMinutes: number,
  initialSeconds: number,
  onTick?: (minutes: number, seconds: number) => void,
  onComplete?: () => void
) {
  let totalTimeInSeconds = initialMinutes * 60 + initialSeconds;
  let intervalId: NodeJS.Timeout | null = null;

  const formatTime = (minutes: number, seconds: number): string => {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const getCurrentTime = () => {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    return { minutes, seconds };
  };

  const start = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      if (totalTimeInSeconds <= 0) {
        stop();
        if (onComplete) onComplete();
        return;
      }

      totalTimeInSeconds -= 1;
      const { minutes, seconds } = getCurrentTime();
      if (onTick) onTick(minutes, seconds);
    }, 1000);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const reset = () => {
    stop();
    totalTimeInSeconds = initialMinutes * 60 + initialSeconds;
    const { minutes, seconds } = getCurrentTime();
    if (onTick) onTick(minutes, seconds);
  };
  const setTime = (minutes: number, seconds: number) => {
    stop();
    totalTimeInSeconds = minutes * 60 + seconds;
    const { minutes: currentMinutes, seconds: currentSeconds } =
      getCurrentTime();
    if (onTick) onTick(currentMinutes, currentSeconds);
  };
  const pause = () => {
    stop();
  };

  const resume = () => {
    start();
  };

  const getFormattedTime = (): string => {
    const { minutes, seconds } = getCurrentTime();
    return formatTime(minutes, seconds);
  };

  return {
    start,
    stop,
    reset,
    pause,
    resume,
    getFormattedTime,
    getCurrentTime,
    setTime
  };
}

