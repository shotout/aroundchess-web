"use client";

import Image from "next/image";
import React from "react";

interface MoveHistoryProps {
  moveHistory: any[];
}

export default function MoveHistory({ moveHistory }: MoveHistoryProps) {
  const getPieceType = (move: any) => {
    if (!move || !move.san) return "P";

    const san = move.san;

    if (san.startsWith("O-O")) return "K";

    const firstChar = san.charAt(0);

    if (firstChar === firstChar.toUpperCase() && firstChar.match(/[KQRBN]/)) {
      switch (firstChar) {
        case "K":
          return "K";
        case "Q":
          return "Q";
        case "R":
          return "R";
        case "B":
          return "B";
        case "N":
          return "N";
      }
    }

    return "P";
  };

  return (
    <div className="p-4">
      <div className="h-auto rounded-md border border-[#BDD0F9] overflow-y-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-center border border-b-[#BDD0F9] border-r-[#BDD0F9] w-12">
                #
              </th>
              <th className="p-2 text-center w-1/2">White</th>
              <th className="p-2 text-center w-1/2">Black</th>
            </tr>
          </thead>
          <tbody>
            {moveHistory.length === 0 ? (
              <tr>
                <td className="p-2 text-center border" colSpan={3}>
                  No moves yet
                </td>
              </tr>
            ) : (
              Array.from({
                length: Math.ceil(moveHistory.length / 2),
              }).map((_, i) => {
                const whiteIdx = i * 2;
                const blackIdx = i * 2 + 1;

                return (
                  <tr key={i}>
                    <td className="p-2 text-center border border-r-[#BDD0F9] w-12">
                      {i + 1}
                    </td>
                    <td className="p-2 border-t border-b border-[#BDD0F9] text-center align-middle h-10">
                      {whiteIdx < moveHistory.length ? (
                        <div className="flex items-center justify-center">
                          <Image
                            src={`/pieces/wood/w${getPieceType(
                              moveHistory[whiteIdx]
                            )}.png`}
                            width={20}
                            height={20}
                            alt={moveHistory[whiteIdx]?.san || ""}
                            className="mr-2"
                          />
                          <span className="truncate">
                            {moveHistory[whiteIdx]?.san || ""}
                          </span>
                        </div>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </td>
                    <td className="p-2 border-t border-r border-b border-[#BDD0F9] text-center align-middle h-10">
                      {blackIdx < moveHistory.length ? (
                        <div className="flex items-center justify-center">
                          <Image
                            src={`/pieces/wood/b${getPieceType(
                              moveHistory[blackIdx]
                            )}.png`}
                            width={20}
                            height={20}
                            alt={moveHistory[blackIdx]?.san || ""}
                            className="mr-2"
                          />
                          <span className="truncate">
                            {moveHistory[blackIdx]?.san || ""}
                          </span>
                        </div>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
