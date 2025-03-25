import Spinner from "@/components/ui/spinner";
import React, { useEffect, useState } from "react";
import PgnPlayer from "./LoadingChess";
import { usePgnStore } from "@/app/store/zustandStore";
import { unixFormatDate } from "@/functions/unix-format-date";
import { Chess } from "chess.js";

const LoadingPage: React.FC = (props) => {
  const {
    pgn: storePgn,
    dataAnalysis,
    dataGames,
    dataGamesImport,
    setDataGamesImport,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { gameInfo, summary } = dataAnalysis ?? {};
  const dataGame = dataGamesImport != null ? dataGamesImport : dataGames;
  const [headerPGN, setHeaderPGN] = useState<any>({});
  useEffect(() => {
    getHeaders();
  }, [storePgn]);
  const getHeaders = () => {
    const tempGame = new Chess();
    tempGame.loadPgn(storePgn);
    // Check if the PGN was loaded successfully
    if (tempGame.pgn() === "") {
      return false;
    }
    let headers = tempGame.getHeaders();
    setHeaderPGN(headers);
    let dataGames = {
      white: {
        result: headers.Result == "0-1" ? "lose" : "win",
        username: headers.White,
      },
      black: {
        result: headers.Result == "0-1" ? "win" : "lose",
        username: headers.Black,
      },
      date: headers.Date,
    };
    setDataGamesImport(dataGames);
    console.log("tempGame.getHeaders()", headers);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center py-4">
        <Spinner />
        {dataGame && (
          <div className="border border-input rounded-md flex flex-col items-center justify-center bg-white p-4 my-4 mx-4">
           {dataGame?.date && gameInfo == null && (
              <span className="text-sm text-center">
                {dataGame?.date}
              </span>
            )}
            {dataGame?.end_time && gameInfo == null && (
              <span className="text-sm text-center">
                {unixFormatDate(dataGame?.end_time, "Y-m-d")}
              </span>
            )}
            {gameInfo && (
              <span className="text-sm text-center">{gameInfo?.date}</span>
            )}
            <span className="text-sm text-center">
              <span
                className={`text-lg font-semibold ${
                  dataGame?.white?.result == "win"
                    ? "text-[#00B427]"
                    : "text-black"
                }`}
              >
                {dataGame?.white?.username}
              </span>{" "}
              (White)
              <span
                className={`text-lg font-semibold ${
                  dataGame?.black?.result == "win"
                    ? "text-[#00B427]"
                    : "text-black"
                }`}
              >
                {" "}
                vs {dataGame?.black?.username}{" "}
              </span>{" "}
              (Black)
            </span>
          </div>
        )}

        <div className="hidden md:block absolute top-80 left-0 md:left-0 w-[600px] sm:w-[250px] h-[500px] sm:h-[150px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="hidden md:block absolute top-80 right-0 md:right-0 w-[600px] sm:w-[250px] h-[500px] sm:h-[150px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="block sm:hidden absolute self-center top-86 right-24 left-24 bottom-0 w-[200px] sm:w-[350px] md:w-[460px] h-[200px] sm:h-[250px] md:h-[300px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        {/* <div className="hidden md:block absolute bottom-0 right-0 md:right-20 md:bottom-12 w-[600px] sm:w-[200px] h-[500px] sm:h-[150px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div> */}
        <PgnPlayer />
      </div>
    </>
  );
};
export default LoadingPage;
