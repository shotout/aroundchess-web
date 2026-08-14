export const squareSize = 11;

export const getMoveHighlightStyle = (
  square: string,
  isCapture: boolean,
  boardOrientation: "white" | "black",
  color?: string
): React.CSSProperties => {
  const column = square[0];
  const row = square[1];
  const top =
    boardOrientation === "white"
      ? `${100 - parseInt(row) * squareSize - 6}%`
      : `${(parseInt(row) - 1) * squareSize + 6}%`;
  const left =
    boardOrientation === "white"
      ? `${(column.charCodeAt(0) - "a".charCodeAt(0)) * squareSize + 6}%`
      : `${(7 - (column.charCodeAt(0) - "a".charCodeAt(0))) * squareSize + 6}%`;

  return {
    position: "absolute",
    top,
    left,
    width: `${squareSize}%`,
    height: `${squareSize}%`,
    background: isCapture
      ? "radial-gradient(transparent 0%, transparent 80%, rgba(0, 0, 0, 0.7) 80%)"
      : color,
    clipPath: isCapture ? "none" : "circle(13% at 50% 50%)",
    pointerEvents: "none",
    zIndex: 10,
  };
};

export const getLastMoveHighlightStyle = (
  square: string,
  boardOrientation: "white" | "black",
  color?: string
): React.CSSProperties => {
  const column = square[0];
  const row = square[1];
  const top =
    boardOrientation === "white"
      ? `${100 - parseInt(row) * squareSize - 5.9}%`
      : `${(parseInt(row) - 1) * squareSize + 6}%`;
  const left =
    boardOrientation === "white"
      ? `${(column.charCodeAt(0) - "a".charCodeAt(0)) * squareSize + 6.06}%`
      : `${(7 - (column.charCodeAt(0) - "a".charCodeAt(0))) * squareSize + 6}%`;

  return {
    position: "absolute",
    top,
    left,
    width: `${squareSize}%`,
    height: `${squareSize}%`,
    background: color ? color : "rgba(125, 172, 201, 0.5)",
    pointerEvents: "none",
    zIndex: 9,
  };
};

export const getHintHighlightStyle = (
  square: string,
  boardOrientation: "white" | "black",
  color?: string
): React.CSSProperties => {
  const column = square[0];
  const row = square[1];
  const top =
    boardOrientation === "white"
      ? `${100 - parseInt(row) * squareSize - 6}%`
      : `${(parseInt(row) - 1) * squareSize + 6}%`;
  const left =
    boardOrientation === "white"
      ? `${(column.charCodeAt(0) - "a".charCodeAt(0)) * squareSize + 6}%`
      : `${(7 - (column.charCodeAt(0) - "a".charCodeAt(0))) * squareSize + 6}%`;

  return {
    position: "absolute",
    top,
    left,
    width: `${squareSize}%`,
    height: `${squareSize}%`,
    background: color ? color : "rgba(255, 0, 0, 0.2)",
    pointerEvents: "none",
    zIndex: 11,
  };
};

export const getInvalidMoveHighlightStyle = (
  square: string,
  boardOrientation: "white" | "black"
): React.CSSProperties => {
  const column = square[0];
  const row = square[1];
  const top =
    boardOrientation === "white"
      ? `${100 - parseInt(row) * squareSize - 6}%`
      : `${(parseInt(row) - 1) * squareSize + 6}%`;
  const left =
    boardOrientation === "white"
      ? `${(column.charCodeAt(0) - "a".charCodeAt(0)) * squareSize + 6}%`
      : `${(7 - (column.charCodeAt(0) - "a".charCodeAt(0))) * squareSize + 6}%`;

  return {
    position: "absolute",
    top,
    left,
    width: `${squareSize}%`,
    height: `${squareSize}%`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "red",
    fontSize: "2rem",
    fontWeight: "bold",
    pointerEvents: "none",
    zIndex: 12,
    content: "\u274C",
  };
};
