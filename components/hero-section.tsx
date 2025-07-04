"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import axios from "axios";
import { toast } from "sonner";
import { FamousGameButton } from "./famous-game-button";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfileStore } from "@/app/store/profile";
import { useLoadingAPI } from "@/app/store/loadingApi";
const AnalysisUrl = process.env.BASE_URL! + "/analyze";
const AnalyticsUrl = process.env.BASE_URL! + "/chessdotcom/games";

export function HeroSection() {
  const router = useRouter();
  const { proceedAnalysis, pgnToFenList } = useStockfishAnalysis();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const {
    analyzeComplete,
    estimateMinute,
    estimateSecond,
    setEstimateMinute,
    setEstimateSecond,
  } = useLoadingAPI();
  useEffect(() => {
    const checkSession = () => {
      if (sessionId != "") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);
  const [username, setUsername] = useState<string>("");
  const [width, setWidth] = useState(0);
  const {
    usernameAnalysis,
    setUsernameAnalysis,
    setPgn,
    setIsLoading,
    setError,
    isLoading,
    dataAnalysis,
    setDataAnalysis,
    setDataGames,
    dataGames,
  } = usePgnStore();

  const fetchPgn = async () => {
    let arr = null;
    try {
      setIsLoading(true);
      const config = {
        headers: {},
      };
      setEstimateMinute(0);
      setEstimateSecond(0);
      const url = AnalyticsUrl + "/" + username;
      console.log(username, url, isLoading);
      const response = await axios.get(url, config);
      console.log("response analyze homepage", response);
      if (response.data[0] != null) {
        setPgn(response.data[0].data_games?.pgn);
        setDataGames(response.data[0].data_games);
        let pgn = pgnToFenList(response.data[0].data_games?.pgn);
        let basic = 6;
        let basicResult = pgn && pgn?.length * basic;
        let basicFormat = getTime(basicResult);
        setEstimateMinute(basicFormat.minute);
        setEstimateSecond(basicFormat.second);
        // V2 Flow
        const responseAnalysis = await proceedAnalysis(
          response.data[0].data_games?.pgn,
          username,
          10,
          60000
        );

        setDataAnalysis(responseAnalysis.data);
        arr = responseAnalysis.data;
        setError(null);
      } else {
        toast.error("Username not exist in database");
      }
      // router.push("/analysis");
    } catch (err) {
      console.log("error", err);
      toast.error(err + "");
      router.push("/");
      setIsLoading(false);

      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      if (arr != null) {
        router.push("/analysis");
      } else {
        setIsLoading(false);
      }
    }
  };
  const getTime = (seconds: number): any => {
    let s = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(s % 60);
    let time = { minute: minutes, second: remainingSeconds };
    return time;
  };
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    setDataAnalysis(null);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderInsertUsername = () => {
    return (
      <div className="max-w-[668px] mt-48 bg-white z-100 sm:mx-7 sm:mt-1 sm:bg-white sm:bg-clip-padding sm:backdrop-filter sm:backdrop-blur-sm sm:bg-opacity-75 border border-[#DEDEDE] rounded-md p-4 flex flex-col gap-2 sm:justify-center lg:justify-start">
        <p className="w-full block text-base text-start font-semibold sm:text-xl text-gray-600">
          Analyze your most recent Game now:
        </p>
        <p className="block mb-3 text-xs text-start sm:text-md text-gray-600">
          Simply enter your Chess.com Username below and the AroundChess Engine
          will analyze your game.
        </p>
        <div className="flex flex-row items-center">
          <Image
            src="/icons/hero-section.png"
            alt="chess"
            width={100}
            height={100}
            className="w-3 h-4 relative z-10"
            priority
          />
          <p className="block ml-1 text-base sm:text-lg md:text-md lg:text-lg text-gray-600">
            Chess.com Username
          </p>
        </div>

        <input
          type="text"
          id="username"
          value={username}
          placeholder="Enter your Chess.com Username"
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameAnalysis(e.target.value);
          }}
          className="block w-full p-3  border border-gray-300 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          className="btn-primary mt-2 w-full text-xs px-2 py-2 rounded-full"
          onClick={fetchPgn}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Analyze now"
          )}
        </button>
      </div>
    );
  };

  return (
    <section className="flex flex-1 relative overflow-hidden py-4 sm:bg-white lg:pb-8 lg:pt-0 w-full">
      <div className="container mx-auto px-4 md:px-0 lg:px-8 z-10">
        <motion.div
          className="flex flex-col sm:flex-row items-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="sm:w-2/3 lg:pr-12 mb-4 lg:mb-0 text-center sm:text-left"
            variants={fadeInUp}
          >
            <div className="bg-[black] sm:bg-transparent rounded-lg p-4 sm:p-8">
              <h1 className="font-heading text-lg text-white sm:text-black sm:text-xl xl:text-4xl tracking-tight ">
                <span className="block sm:mb-0">
                  Understand your{" "}
                  <span className="text-primary font-bold">Chess</span> Game
                  with our
                </span>
                <span className="font-heading text-lg sm:text-xl xl:text-4xl font-bold tracking-wide text-black-900">
                  Advanced Game Analysis
                </span>
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-lg text-white sm:text-black font-light max-w-2xl mx-auto lg:mx-0">
                Experience an in-depth analysis of every move with our
                cutting-edge tools and AI-driven insights - simply by looking up
                your Chess.com account.
              </p>
            </div>
            {isSignedIn ? renderInsertUsername() : <FamousGameButton />}
          </motion.div>
        </motion.div>
      </div>
      {/* <div className="hidden lg:block absolute top-80 left-20 lg:left-40 w-[50px] sm:w-[50px] md:w-[200px] h-[250px] sm:h-[50px] md:h-[200px] bg-[#25CEDA] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div> */}
      {/* <div className="hidden lg:block absolute top-0 right-0 w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] bg-white-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="hidden md:block absolute bottom-0 right-0 md:right-20 md:bottom-12 w-[600px] sm:w-[400px] h-[500px] sm:h-[450px] bg-[#25CEDA] rounded-full mix-blend-multiply filter blur-3xl opacity-24 animate-pulse-slow z-1"></div> */}
      <div className="block z-2 absolute  w-[100%] h-[620px] lg:h-auto">
        <Image
          src={
            width > 1024
              ? "/images/homepage/hero-banner-homepage.png"
              : width > 572
              ? "/images/homepage/hero-banner-homepage-tablet.png"
              : "/images/homepage/hero-banner-homepage-mobile.png"
          }
          alt="herobanner"
          width={1000}
          height={1000}
          className="w-[100%] h-[80vh] sm:h-[90vh] md:h-[80vh] lg:h-auto object-cover z-2 relative overflow-hidden"
          priority
        />
      </div>
    </section>
  );
}
