"use client";


import { useState } from "react";


const MistakeLog = () => {

  return (
      <main className="w-full px-4 py-4 space-y-[16px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-end gap-2">
            <h1 className="text-base lg:text-3xl font-bold">Mistake Log</h1>
            <div className="flex justify-center items-end h-full">
              <p className="text-xs text-gray-500 lg:text-lg">
                {"(Blitzmystic)"}
              </p>
            </div>
          </div>
        </div>
      </main>
  );
};

export default MistakeLog;
