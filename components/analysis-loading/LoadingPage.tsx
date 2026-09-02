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
  } = usePgnStore(); 
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
  const [countDownBefore, setCountDownBefore] = useState<string>("");
  const [countDownAfter, setCountDownAfter] = useState<string>("");
  useEffect(() => {
    console.log("basicFormat", estimateMinute, estimateSecond);
    if (!isLoading) {
      setEstimateMinute(0);
      setEstimateSecond(0);
    } else {
      if (estimateSecond == 0 && estimateMinute == 0) {
        const pgn = pgnToFenList(storePgn);
        const basic = 6;
        const basicResult = pgn && pgn?.length * basic;
        const basicFormat = getTime(basicResult);
        setEstimateMinute(basicFormat.minute);
        setEstimateSecond(basicFormat.second);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, estimateSecond]);

  const getTime = (seconds: number): any => {
    const s = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(s % 60);
    const time = { minute: minutes, second: remainingSeconds };
    return time;
  };

  useEffect(() => {
    getHeaders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePgn]);
  const getHeaders = () => {
    const tempGame = new Chess();
    tempGame.loadPgn(storePgn);
    if (tempGame.pgn() === "") {
      return false;
    }
    const headers = tempGame.getHeaders();
    console.log("headers pgn", headers);
    setHeaderPGN(headers);
    const dataGames = {
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

  useEffect(() => {
    if (dataAnalysis != null) {
      setEstimateMinute(0);
      setEstimateSecond(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimateSecond, dataAnalysis]);
  useEffect(() => {
    const countdownBefore = createCountdown(
      estimateMinute,
      estimateSecond,
      (min, sec) => {
        const minuteFormat = min < 10 ? "0" + min : min;
        const secondFormat = sec < 10 ? "0" + sec : sec;
        if (!analyzeComplete)
          setCountDownBefore(`${minuteFormat}:${secondFormat}`);
      },
      () => console.log("Countdown complete!")
    );
    const countdownAfter = createCountdown(
      estimateMinute,
      estimateSecond,
      (min, sec) => {
        const minuteFormat = min < 10 ? "0" + min : min;
        const secondFormat = sec < 10 ? "0" + sec : sec;
        setCountDownAfter(`${minuteFormat}:${secondFormat}`);
      },
      () => console.log("Countdown complete!")
    );
    console.log("analyzeComplete", analyzeComplete);
    if (dataAnalysis != null) {
      countdownBefore.stop();
      countdownAfter.stop();
    }
    if (analyzeComplete) {
      countdownBefore.stop();

      const estimateM = Math.round(estimateMinute / 2);
      const estimateS = Math.round(estimateSecond / 2);
      setEstimateMinute(estimateM);
      setEstimateSecond(estimateS);
      countdownAfter.setTime(estimateM, estimateS);
      countdownAfter.start();
      // if (estimateMinute >= 30) {
      //   setEstimateMinute(4);
      //   setEstimateSecond(10);
      //   countdownAfter.setTime(6, 30);
      //   countdownAfter.start();
      // } else if (estimateMinute >= 20) {
      //   setEstimateMinute(3);
      //   setEstimateSecond(10);
      //   countdownAfter.setTime(5, 30);
      //   countdownAfter.start();
      // } else if (estimateMinute >= 10) {
      //   setEstimateMinute(3);
      //   setEstimateSecond(10);
      //   countdownAfter.setTime(4, 30);
      //   countdownAfter.start();
      // } else if (estimateMinute >= 5) {
      //   setEstimateMinute(2);
      //   setEstimateSecond(10);
      //   countdownAfter.setTime(3, 30);
      //   countdownAfter.start();
      // }
    } else {
      console.log("estimateMinute", estimateMinute, estimateSecond);
      if (!analyzeComplete) {
        countdownBefore.setTime(estimateMinute, estimateSecond);
        countdownBefore.start();
      }
    }
  }, [analyzeComplete]);
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
              {analyzeComplete ? countDownAfter : countDownBefore}
            </span>
          </span>
        </div>
        {dataGame && (
          <div className="border border-input rounded-md flex flex-col items-center justify-center bg-white p-4 my-4 mx-4">
            {dataGame?.date && gameInfo == null && (
              <span className="text-[14px] --sm text-center">{dataGame?.date}</span>
            )}
            {dataGame?.end_time && gameInfo == null && (
              <span className="text-[14px] --sm text-center">
                {unixFormatDate(dataGame?.end_time, "Y-m-d")}
              </span>
            )}
            {gameInfo && (
              <span className="text-[14px] --sm text-center">{gameInfo?.date}</span>
            )}
            <span className="text-[14px] --sm text-center">
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
                {whiteCountry != "XX" && (
                  <ReactCountryFlag
                    countryCode={whiteCountry}
                    svg
                    className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px] shadow-md"
                    title={whiteCountry}
                  />
                )}{" "}
                vs {dataGame?.black?.username}{" "}
              </span>{" "}
              (Black){" "}
              {blackCountry != "XX" && (
                <ReactCountryFlag
                  countryCode={blackCountry}
                  svg
                  className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px] shadow-md"
                  title={blackCountry}
                />
              )}
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
