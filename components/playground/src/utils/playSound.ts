export const playMoveSound = () => {
  const audio = new Audio("/audio/piece-move.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export const playCaptureSound = () => {
  const audio = new Audio("/audio/capture.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export const playCastlingSound = () => {
  const audio = new Audio("/audio/castling.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export const playCheckSound = () => {
  const audio = new Audio("/audio/check.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export const playCheckmateSound = () => {
  const audio = new Audio("/audio/checkmate.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export const playPromoteSound = () => {
  const audio = new Audio("/audio/promote.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export const playIncorrectMoveSound = () => {
  const audio = new Audio("/audio/Incorrect Move.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};
