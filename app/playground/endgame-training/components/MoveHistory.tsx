"use client";

import React from "react";

interface MoveHistoryProps {
  moveHistory: any[];
}

export default function MoveHistory({ moveHistory }: MoveHistoryProps) {
  return (
    <div className="flex-grow p-4">
      <div className="max-h-[250px] rounded-md overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-left border border-gray-200 border-r">
                #
              </th>
              <th className="p-4 text-center border border-gray-200 border-r">
                White
              </th>
              <th className="p-4 text-center border border-gray-200">Black</th>
            </tr>
          </thead>
          <tbody>
            {moveHistory.length === 0 ? (
              <tr>
                <td
                  className="p-4 text-center border border-gray-200"
                  colSpan={3}
                >
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
                    <td className="p-4 text-center border border-gray-200">
                      {i + 1}
                    </td>
                    <td className="p-4 text-center border border-gray-200">
                      {moveHistory[whiteIdx]?.san || ""}
                    </td>
                    <td className="p-4 text-center border border-gray-200">
                      {blackIdx < moveHistory.length
                        ? moveHistory[blackIdx]?.san || ""
                        : ""}
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
