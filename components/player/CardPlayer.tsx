"use client";

import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
interface CardPlayerProps {
  isWin: boolean;
  profilePhoto: string;
  username?: string;
  country: string;
  capturedPieces?: any[];
}
export const CardPlayer = ({
  isWin,
  profilePhoto,
  username,
  country,
  capturedPieces,
}: CardPlayerProps) => {
  const { PieceChoosed } = useChessBoardThemeStore();
  return (
    <div
      className={`w-full border ${
        isWin ? "border-[#00B427] bg-[#D3FFDD]" : "bg-white"
      } p-2 rounded-md flex flex-row justify-between items-center gap-2`}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          alt="avatar"
          src={profilePhoto}
          className="w-10 h-10 rounded-full"
          width={1000}
          height={1000}
        />
        {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
        <div className="flex flex-col line-clamp-1 ">
          <div className="flex flex-row items-center gap-2 line-clamp-1">
            <span
              className={`text-xs sm:text-sm md:text-md lg:text-[18px] font-medium ${
                !isWin ? "text-black" : "text-[#00B427]"
              }`}
            >
              {username}
            </span>
          </div>

          <div className="flex flex-row gap-1">
            {capturedPieces &&
              capturedPieces.length > 0 &&
              capturedPieces
                .sort((a, b) => a.captured.localeCompare(b.captured))
                .map((captured, index) => {
                  let icon = captured.captured;
                  let nextIcon = capturedPieces[index + 1]
                    ? capturedPieces[index + 1].captured
                    : "";
                  return (
                    <div
                      key={index}
                      className={`${icon == nextIcon ? "-mr-2" : ""}`}
                    >
                      {icon && (
                        <Image
                          src={`/pieces/${PieceChoosed}/${icon}.png`}
                          alt="icon"
                          width={1000}
                          height={1000}
                          className="w-3 h-4 sm:w-4 sm:h-5 lg:w-4 lg:h-5 object-contain inline-block"
                        />
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <ReactCountryFlag
        countryCode={country}
        svg
        className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
        title={country}
      />
    </div>
  );
};
