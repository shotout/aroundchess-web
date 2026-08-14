type CountdownCallbacks = {
    onTick?: (timeLeft: string) => void;
    onEnd?: () => void;
  };
  
  export class ChessCountdown {
    private initialSeconds: number;
    private remainingSeconds: number;
    private intervalId: NodeJS.Timeout | null = null;
    private incrementPerMove: number;
    private onTick?: (timeLeft: string) => void;
    private onEnd?: () => void;
  
    constructor(
      minutes: number,
      incrementSeconds: number = 0,
      callbacks?: CountdownCallbacks
    ) {
      this.initialSeconds = minutes * 60;
      this.remainingSeconds = this.initialSeconds;
      this.incrementPerMove = incrementSeconds;
      this.onTick = callbacks?.onTick;
      this.onEnd = callbacks?.onEnd;
    }
  
    private formatTime(seconds: number): string {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  
    private tick = () => {
      if (this.remainingSeconds <= 0) {
        this.pause();
        this.onEnd?.();
        return;
      }
  
      this.remainingSeconds--;
      this.onTick?.(this.formatTime(this.remainingSeconds));
    };
  
    start() {
      this.pause();
      this.onTick?.(this.formatTime(this.remainingSeconds));
      this.intervalId = setInterval(this.tick, 1000);
    }
  
    pause() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  
    resume() {
      if (!this.intervalId && this.remainingSeconds > 0) {
        this.intervalId = setInterval(this.tick, 1000);
      }
    }
  
    applyIncrement() {
      this.remainingSeconds += this.incrementPerMove;
      this.onTick?.(this.formatTime(this.remainingSeconds));
    }
  
    reset(minutes?: number) {
      this.pause();
      this.remainingSeconds = (minutes ?? this.initialSeconds / 60) * 60;
      this.onTick?.(this.formatTime(this.remainingSeconds));
    }
  
    getTimeLeft(): string {
      return this.formatTime(this.remainingSeconds);
    }
  }
  