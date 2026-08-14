import React, { useState, useEffect } from 'react';

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
    const [arrowWidth, setArrowWidth] = useState(10);
    const [arrowheadSize, setArrowheadSize] = useState({ width: 20, height: 20, pathSize: 14 });

    useEffect(() => {
        const updateArrowWidth = () => {
            if (window.innerWidth > 2000) {
                setArrowWidth(16);
                setArrowheadSize({ width: 32, height: 32, pathSize: 22 });
            }
            else if (window.innerWidth > 1500) {
                setArrowWidth(12);
                setArrowheadSize({ width: 24, height: 24, pathSize: 16 });
            }
            else if (window.innerWidth > 576) {
                setArrowWidth(10);
                setArrowheadSize({ width: 22, height: 22, pathSize: 15 });
            }
            else {
                setArrowWidth(9);
                setArrowheadSize({ width: 20, height: 20, pathSize: 14 });
            }
        };

        updateArrowWidth();
        window.addEventListener('resize', updateArrowWidth);
        return () => window.removeEventListener('resize', updateArrowWidth);
    }, []);

    const actualBoardSize = Math.round(boardSize - boardSize / 8.2);
    const padding = (boardSize - actualBoardSize) / 2;
    const actualSquareSize = actualBoardSize / 8;

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

    const createLShapedPath = (from: string, to: string): string => {
        const fromCoords = squareToCoords(from);
        const toCoords = squareToCoords(to);

        const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const rankFrom = parseInt(from[1]) - 1;
        const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
        const rankTo = parseInt(to[1]) - 1;

        const fileDiff = fileTo - fileFrom;

        let midSquare: string;

        if (Math.abs(fileDiff) === 2) {
            midSquare = String.fromCharCode('a'.charCodeAt(0) + fileTo) + (rankFrom + 1);
        } else {
            midSquare = String.fromCharCode('a'.charCodeAt(0) + fileFrom) + (rankTo + 1);
        }

        const midCoords = squareToCoords(midSquare);

        const shortenedEnd = shortenLineEnd(midCoords.x, midCoords.y, toCoords.x, toCoords.y);

        return `M ${fromCoords.x} ${fromCoords.y} L ${midCoords.x} ${midCoords.y} L ${shortenedEnd.x} ${shortenedEnd.y}`;
    };

    const createStraightPath = (from: string, to: string): string => {
        const fromCoords = squareToCoords(from);
        const toCoords = squareToCoords(to);

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
                        markerWidth={arrowheadSize.width}
                        markerHeight={arrowheadSize.height}
                        refX="0.1"
                        refY={arrowheadSize.height / 2}
                        orient="auto"
                        markerUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M0,0 L0,${arrowheadSize.height} L${arrowheadSize.pathSize},${arrowheadSize.height / 2} z`}
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
                        strokeWidth={arrowWidth}
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
