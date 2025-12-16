import React from 'react';

interface ArrowConfig {
    from: string;
    to: string;
    color: string;
    isKnightMove: boolean;
}

interface CustomChessArrowsProps {
    arrows: ArrowConfig[];
    boardSize: number;
    orientation: 'white' | 'black';
}

export const CustomChessArrows: React.FC<CustomChessArrowsProps> = ({
    arrows,
    boardSize,
    orientation
}) => {
    const padding = Math.round(boardSize / 16.5);
    const actualBoardSize = boardSize - (padding * 2);
    const actualSquareSize = actualBoardSize / 8;

    // Convert chess notation to coordinates
    const squareToCoords = (square: string): { x: number; y: number } => {
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
        const rank = parseInt(square[1]) - 1;

        let x, y;
        if (orientation === 'white') {
            x = file * actualSquareSize + actualSquareSize / 2 + padding;
            y = (7 - rank) * actualSquareSize + actualSquareSize / 2 + padding;
        } else {
            x = (7 - file) * actualSquareSize + actualSquareSize / 2 + padding;
            y = rank * actualSquareSize + actualSquareSize / 2 + padding;
        }

        return { x, y };
    };

    // Shorten line end to make room for arrowhead
    const shortenLineEnd = (fromX: number, fromY: number, toX: number, toY: number, shortenBy: number = 12) => {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return { x: toX, y: toY };

        const ratio = (length - shortenBy) / length;
        return {
            x: fromX + dx * ratio,
            y: fromY + dy * ratio
        };
    };

    // Create L-shaped path for knight moves
    const createLShapedPath = (from: string, to: string): string => {
        const fromCoords = squareToCoords(from);
        const toCoords = squareToCoords(to);

        const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const rankFrom = parseInt(from[1]) - 1;
        const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
        const rankTo = parseInt(to[1]) - 1;

        const fileDiff = fileTo - fileFrom;

        // Determine intermediate point for L-shape
        // We'll use the corner of the L as the intermediate point
        let midSquare: string;

        if (Math.abs(fileDiff) === 2) {
            // Move 2 squares horizontally first, then 1 vertically
            // Intermediate square: destination file, starting rank
            midSquare = String.fromCharCode('a'.charCodeAt(0) + fileTo) + (rankFrom + 1);
        } else {
            // Move 2 squares vertically first, then 1 horizontally
            // Intermediate square: starting file, destination rank
            midSquare = String.fromCharCode('a'.charCodeAt(0) + fileFrom) + (rankTo + 1);
        }

        const midCoords = squareToCoords(midSquare);

        // Shorten the final segment to make room for arrowhead
        const shortenedEnd = shortenLineEnd(midCoords.x, midCoords.y, toCoords.x, toCoords.y);

        // Create path: start -> corner point -> shortened end
        return `M ${fromCoords.x} ${fromCoords.y} L ${midCoords.x} ${midCoords.y} L ${shortenedEnd.x} ${shortenedEnd.y}`;
    };

    // Create straight path for non-knight moves
    const createStraightPath = (from: string, to: string): string => {
        const fromCoords = squareToCoords(from);
        const toCoords = squareToCoords(to);

        // Shorten the line to make room for arrowhead
        const shortenedEnd = shortenLineEnd(fromCoords.x, fromCoords.y, toCoords.x, toCoords.y);

        return `M ${fromCoords.x} ${fromCoords.y} L ${shortenedEnd.x} ${shortenedEnd.y}`;
    };

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: boardSize,
                height: boardSize,
                pointerEvents: 'none',
                zIndex: 20
            }}
        >
            <defs>
                {arrows.map((arrow, index) => (
                    <marker
                        key={`arrowhead-${index}`}
                        id={`arrowhead-${index}`}
                        markerWidth="20"
                        markerHeight="20"
                        refX="0.1"
                        refY="10"
                        orient="auto"
                        markerUnits="userSpaceOnUse"
                    >
                        <path
                            d="M0,0 L0,20 L14,10 z"
                            fill={arrow.color}
                        />
                    </marker>
                ))}
            </defs>

            {arrows.map((arrow, index) => {
                const path = arrow.isKnightMove
                    ? createLShapedPath(arrow.from, arrow.to)
                    : createStraightPath(arrow.from, arrow.to);

                return (
                    <path
                        key={`arrow-${index}`}
                        d={path}
                        stroke={arrow.color}
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                        markerEnd={`url(#arrowhead-${index})`}
                    />
                );
            })}
        </svg>
    );
};
