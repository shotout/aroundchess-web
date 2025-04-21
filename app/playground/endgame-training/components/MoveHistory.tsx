"use client";

import React from "react";

interface MoveHistoryProps {
  moveHistory: any[];
}

export default function MoveHistory({ moveHistory }: MoveHistoryProps) {
  return (
    <div className="flex-grow p-4">
      <div className="max-h-[250px] rounded-md border border-[#BDD0F9] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-center border border-b-[#BDD0F9] border-r-[#BDD0F9] w-12">
                #
              </th>
              <th className="p-2 text-center">White</th>
              <th className="p-2 text-center">Black</th>
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
                    <td className="p-2 border-t border-b border-[#BDD0F9] text-center">
                      {whiteIdx < moveHistory.length && (
                        <span>
                          <span className="inline-block mr-1">♖</span>
                          <span>{moveHistory[whiteIdx]?.san || ""}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-2 border-t border-r border-b border-[#BDD0F9] text-center">
                      {blackIdx < moveHistory.length && (
                        <span>
                          <span className="inline-block mr-1">♖</span>
                          <span>{moveHistory[blackIdx]?.san || ""}</span>
                        </span>
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
