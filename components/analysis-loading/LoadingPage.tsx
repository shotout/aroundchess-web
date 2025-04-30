import Spinner from "@/components/ui/spinner";
import React, { useEffect, useState } from "react";
import PgnPlayer from "./LoadingChess";
import { usePgnStore } from "@/app/store/zustandStore";
import { unixFormatDate } from "@/functions/unix-format-date";
import { Chess } from "chess.js";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import ReactCountryFlag from "react-country-flag";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { createCountdown } from "@/functions/create-countdown";

const LoadingPage: React.FC = (props) => {
  const {
    pgn: storePgn,
    dataAnalysis,
    dataGames,
    dataGamesImport,
    setDataGamesImport,
    isLoading,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { pgnToFenList } = useStockfishAnalysis();
  const {
    analyzeComplete,
    estimateMinute,
    estimateSecond,
    setEstimateMinute,
    setEstimateSecond,
  } = useLoadingAPI();
  const { gameInfo, summary } = dataAnalysis ?? {};

  const blackCountry = summary?.blackSide?.profileInfo?.chessAccountInfo
    ?.country
    ? summary?.blackSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";

  const whiteCountry = summary?.whiteSide?.profileInfo?.chessAccountInfo
    ?.country
    ? summary?.whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";
  const dataGame = dataGamesImport != null ? dataGamesImport : dataGames;
  const [headerPGN, setHeaderPGN] = useState<any>({});
  const [countDown, setCountDown] = useState<string>("");
  useEffect(() => {
    console.log("basicFormat", estimateMinute, estimateSecond);
    if (!isLoading) {
      setEstimateMinute(0);
      setEstimateSecond(0);
    } else {
      if (estimateSecond == 0 && estimateMinute == 0) {
        // set estimate time
        let pgn = pgnToFenList(storePgn);
        let basic = 6;
        let basicResult = pgn && pgn?.length * basic;
        let basicFormat = getTime(basicResult);
        setEstimateMinute(basicFormat.minute);
        setEstimateSecond(basicFormat.second);
      }
    }
  }, [isLoading, estimateSecond]);

  const getTime = (seconds: number): any => {
    let s = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(s % 60);
    let time = { minute: minutes, second: remainingSeconds };
    return time;
  };

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
  const countdown = createCountdown(
    estimateMinute,
    estimateSecond,
    (min, sec) => {
      let minuteFormat = min < 10 ? "0" + min : min;
      let secondFormat = sec < 10 ? "0" + sec : sec;
      setCountDown(`${minuteFormat}:${secondFormat}`);
    },
    () => console.log("Countdown complete!")
  );
  useEffect(() => {
    if (dataAnalysis != null) {
      setCountDown(`${`00`}:${`00`}`);
      setEstimateMinute(0);
      setEstimateSecond(0);
    } else {
      console.log("estimateMinute", estimateMinute, estimateSecond);
      countdown.start();
    }
  }, [estimateSecond, dataAnalysis, analyzeComplete]);
  return (
    <>
      <div className="flex flex-col items-center justify-center py-4">
        <Spinner />
        <div
          style={{
            background: `linear-gradient(to bottom, #E7F3F7 0%,#DAF2FB 43%,#DAF2FB 100%)`,
          }}
          className="flex rounded-[4px] shadow-md border-2 border-[#ffffff] justify-center items-center p-[8px] h-[36px] min-w-[311px] mt-[16px]"
        >
          <span className="font-medium text-[14px]">
            Time Remaining:{" "}
            <span className="font-bold text-[#221AE9] text-[14px]">
              {countDown}
            </span>
          </span>
        </div>
        {dataGame && (
          <div className="border border-input rounded-md flex flex-col items-center justify-center bg-white p-4 my-4 mx-4">
            {dataGame?.date && gameInfo == null && (
              <span className="text-sm text-center">{dataGame?.date}</span>
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
                <ReactCountryFlag
                  countryCode={blackCountry}
                  svg
                  className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px] shadow-md"
                  title={blackCountry}
                />{" "}
                vs {dataGame?.black?.username}{" "}
              </span>{" "}
              (Black){" "}
              <ReactCountryFlag
                countryCode={whiteCountry}
                svg
                className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px] shadow-md"
                title={whiteCountry}
              />
            </span>
          </div>
        )}

        <div className="hidden md:block absolute top-80 left-0 md:left-0 w-[600px] sm:w-[250px] h-[500px] sm:h-[150px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="hidden md:block absolute top-80 right-0 md:right-0 w-[600px] sm:w-[250px] h-[500px] sm:h-[150px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="block sm:hidden absolute self-center top-86 right-24 left-24 bottom-0 w-[200px] sm:w-[350px] md:w-[460px] h-[200px] sm:h-[250px] md:h-[300px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        {!dataGame && <div className="h-2" />}
        <PgnPlayer />
      </div>
    </>
  );
};
export default LoadingPage;
