export function createCountdown(
  initialMinutes: number,
  initialSeconds: number,
  onTick?: (minutes: number, seconds: number) => void,
  onComplete?: () => void
) {
  // Convert total time to seconds
  let totalTimeInSeconds = initialMinutes * 60 + initialSeconds;
  let intervalId: NodeJS.Timeout | null = null;

  // Format time as MM:SS
  const formatTime = (minutes: number, seconds: number): string => {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Get current time values
  const getCurrentTime = () => {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    return { minutes, seconds };
  };

  // Start the countdown
  const start = () => {
    if (intervalId) return; // Prevent multiple intervals

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

  // Stop the countdown
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // Reset the countdown
  const reset = () => {
    stop();
    totalTimeInSeconds = initialMinutes * 60 + initialSeconds;
    const { minutes, seconds } = getCurrentTime();
    if (onTick) onTick(minutes, seconds);
  };

  // Pause the countdown
  const pause = () => {
    stop();
  };

  // Resume the countdown
  const resume = () => {
    start();
  };

  // Get formatted time string
  const getFormattedTime = (): string => {
    const { minutes, seconds } = getCurrentTime();
    return formatTime(minutes, seconds);
  };

  // Return the public API
  return {
    start,
    stop,
    reset,
    pause,
    resume,
    getFormattedTime,
    getCurrentTime,
  };
}

// Example usage:
// const countdown = createCountdown(2, 30,
//   (min, sec) => console.log(`${min}:${sec}`),
//   () => console.log('Countdown complete!')
// );
// countdown.start();
