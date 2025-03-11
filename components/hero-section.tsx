"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import axios from "axios";

const AnalysisUrl = process.env.BASE_URL! + "/analyze";
const AnalyticsUrl = process.env.BASE_URL! + "/chessdotcom/games";
// const AnalyticsUrl = process.env.BASE_URL + "/analytic-games";

export function HeroSection() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [width, setWidth] = useState(0);
  const {
    setPgn,
    setIsLoading,
    setError,
    isLoading,
    dataAnalysis,
    setDataAnalysis,
    setDataGames,
    dataGames,
  } = usePgnStore();
  const fetcher = () =>{
    console.log("health-check")
    fetch(process.env.BASE_URL! + "/health-check").then((res) =>
      res.json().then((data) => console.log(data))
    );
  }
  const fetchPgn = async () => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods":"GET,OPTIONS,PATCH,DELETE,POST,PUT",
          // "Access-Control-Allow-Credentials": "true",
          // "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          // "Access-Control-Expose-Headers": "*",
        },
      };
      const url = AnalyticsUrl + "/" + username;
      console.log(username, url, isLoading);
      const response = await axios.get(url, config);
      console.log("response", response);
      setPgn(response.data[0].data_games?.pgn);
      setDataGames(response.data[0].data_games);

      const body = { username: username };
      const responseAnalysis = await axios.post(AnalysisUrl, body, config);
      setDataAnalysis(responseAnalysis.data.data);

      // setError(null);
      // router.push("/analysis");
    } catch (err) {
      console.log("error", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      // setTimeout(() => {
      router.push("/analysis");
      // setIsLoading(false);
      // }, 5000);
    }
  };
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    fetcher();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-1 relative overflow-hidden bg-primary py-4 sm:bg-white lg:pb-32 lg:pt-24 w-full">
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
              <h1 className="font-heading text-lg text-white sm:text-black sm:text-xl tracking-tight ">
                <span className="block sm:mb-0">
                  Understand your{" "}
                  <span className="text-primary font-bold">Chess</span> Game
                  with our
                </span>
                <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-black-900">
                  Advanced Game Analysis
                </span>
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white sm:text-black font-light max-w-2xl mx-auto lg:mx-0">
                Experience an in-depth analysis of every move with our
                cutting-edge tools and AI-driven insights - simply by looking up
                your Chess.com account.
              </p>
            </div>
            <div className="mt-48 bg-white sm:mx-7 sm:mt-1 sm:bg-gray-100 sm:bg-clip-padding sm:backdrop-filter sm:backdrop-blur-sm sm:bg-opacity-25 border border-[#DEDEDE] rounded-md p-4 flex flex-col gap-2 sm:justify-center lg:justify-start">
              <p className="w-full block text-base text-start font-semibold sm:text-xl text-gray-600">
                Analyze your most recent Game now:
              </p>
              <p className="block mb-3 text-xs text-start sm:text-md text-gray-600">
                Simply enter your Chess.com Username below and the AroundChess
                Engine will analyze your game.
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
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full p-3 rounded-sm border border-gray-300 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <Button
                size="sm"
                variant="default"
                className="mt-2 w-full text-xs px-2 py-1"
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
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="hidden lg:block absolute top-80 left-20 lg:left-40 w-[50px] sm:w-[50px] md:w-[100px] h-[50px] sm:h-[50px] md:h-[100px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="hidden lg:block absolute top-0 right-0 w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] bg-white-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="hidden md:block absolute bottom-0 right-0 md:right-20 md:bottom-12 w-[600px] sm:w-[200px] h-[500px] sm:h-[150px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

      <div className="absolute top-32 md:top-20 md:w-1/2 md:right-0 h-auto py-2 sm:py-16 lg:py-12">
        <Image
          src={
            width > 572
              ? "/images/homepage/hero-banner.png"
              : "/images/homepage/hero-banner-mobile.png"
          }
          alt="herobanner"
          width={1000}
          height={1000}
          className="w-full h-auto bg-no-repeat relative overflow-hidden rounded-lg bg-cover bg-no-repeat"
          priority
        />
      </div>
    </section>
  );
}
