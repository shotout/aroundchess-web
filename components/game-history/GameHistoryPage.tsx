"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";

import DotSpinner from "./Spinner";
import StatisticsSection from "./components/StatisticsSection";
import ImportDialogButton from "./components/ImportDialogButton";
import LoadingDot from "./components/LoadingDot";
import ChessAccountSetup from "../analysis/onboarding/ChessAccountSetup";
import { useProfileStore } from "@/app/store/profile";
import { useTutorial } from "../TutorialProvider";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GameHistoriesTable } from "../game-histories-table";
import AccountNotConnected from "./components/AccountNotConnected";

const GameHistoryPage: React.FC = () => {
  const pathname = usePathname();
  const { username, isOpenTutorial } = usePgnStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { isTutorialPlay, dataTutorial } = useTutorial();

  const [openAccountConnected, setOpenAccountConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  const [isLoading, setIsLoading] = useState(true);
  const [isUsernameFetching, setIsUsernameFetching] = useState(false);

  useEffect(() => {
    if (!isTutorialPlay && !isOpenTutorial) {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      setIsUsernameFetching(true);

      setTimeout(() => {
        setIsLoading(false);
        setIsUsernameFetching(false);
      }, 500);
    }
  }, [isSignedIn]);

  if (!isTutorialPlay && !isOpenTutorial && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      {/* <main className="w-full  bg-primary-white relative"> */}
      <main className="w-full  bg-primary-white">
        <ChessAccountSetup isLoading={isLoading} open={openAccountConnected} setOpen={() => { setOpenAccountConnected(false) }} />
        <div className="p-4 pt-0 md:pt-4">
          <div className="flex items-center justify-left lg:gap-[4px] lg:mb-[32px] mx-[-16px] lg:mx-0 lg:w-full w-[calc(100%+32px)]">
            <Link href={'/my-game-history'} className={`flex items-center gap-[8px] w-[50%] lg:max-w-fit justify-center py-[12px] px-[24px] lg:rounded-t-[12px] bg-[#ECF4FF] lg:bg-[#221AE9] lg:text-white relative text-[#221AE9] before:content-[''] before:w-full before:absolute before:bottom-4px before:left-0 border-b-[4px] border-[#221AE9]`}>
              {/* <Image src="/icons/sidebar-game-history.png" alt="icon" width={24} height={24} className="lg:invert lg:brightness-0" /> */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1691_107866)">
                  <path fill={window.innerWidth > 1280 ? "#FFF" : "#221AE9"} d="M23.8838 22.0918H14.8643V20.1797H23.8838V22.0918ZM11.6641 21.8877H5.72461V20.6289H11.6641V21.8877ZM9.83203 16.4727C9.81835 16.634 9.8047 16.8025 9.80469 16.9639C9.80475 18.5133 10.5439 19.811 11.5225 19.9854L11.6113 19.998L11.7412 20.3076H5.65137L5.78125 19.998L5.87012 19.9854C6.84831 19.8106 7.58783 18.5129 7.58789 16.9639C7.58788 16.8025 7.58106 16.634 7.56055 16.4727L7.54004 16.3047H9.85254L9.83203 16.4727ZM21.1035 13.8652C21.0827 14.1102 21.0615 14.3654 21.0615 14.6104C21.0615 16.9631 22.1841 18.9335 23.6699 19.1982L23.8047 19.2178L24.0029 19.6885H14.7549L14.9521 19.2178L15.0869 19.1982C16.5726 18.9333 17.6953 16.963 17.6953 14.6104C17.6953 14.3654 17.6845 14.1102 17.6533 13.8652L17.6221 13.6104H21.1348L21.1035 13.8652ZM10.7773 16.0596H6.6377V14.7881H10.7773V16.0596ZM8.70801 11.4355C9.7547 11.4358 10.6034 12.2371 10.6035 13.2246V13.7402C10.6035 13.9919 10.5488 14.2384 10.4395 14.4707L10.3984 14.5605H7.01758L6.97656 14.4707C6.86709 14.2383 6.8125 13.992 6.8125 13.7402V13.2246C6.81266 12.237 7.66122 11.4357 8.70801 11.4355ZM22.5332 13.2393H16.2461V11.3086H22.5332V13.2393ZM16.2607 1C16.4203 1.00011 16.5737 1.05977 16.6865 1.16602C16.7994 1.27235 16.8623 1.41703 16.8623 1.56738V6.10352C16.8624 6.21574 16.8269 6.32561 16.7607 6.41895C16.6947 6.51211 16.6011 6.58497 16.4912 6.62793C16.3811 6.67089 16.2595 6.68207 16.1426 6.66016C16.0257 6.63822 15.9182 6.58425 15.834 6.50488L13.8516 4.6377L9.45996 8.77344C9.40411 8.82609 9.33764 8.86795 9.26465 8.89648C9.19154 8.92502 9.11234 8.93945 9.0332 8.93945C8.95421 8.9394 8.87571 8.92497 8.80273 8.89648C8.72971 8.86795 8.6633 8.82611 8.60742 8.77344L6.02246 6.33887L1.02832 11.042C0.915355 11.1482 0.762172 11.208 0.602539 11.208C0.442903 11.208 0.289721 11.1482 0.176758 11.042C0.0638197 10.9356 7.07233e-05 10.791 0 10.6406C0 10.4901 0.0637567 10.3457 0.176758 10.2393L5.59668 5.13574C5.6526 5.08303 5.7189 5.04123 5.79199 5.0127C5.86508 4.98417 5.94335 4.96876 6.02246 4.96875C6.10156 4.96875 6.17985 4.98419 6.25293 5.0127C6.326 5.04122 6.39233 5.08306 6.44824 5.13574L9.0332 7.57031L13 3.83594L11.0166 1.96875C10.9323 1.88944 10.8748 1.78779 10.8516 1.67773C10.8284 1.56786 10.8403 1.4541 10.8857 1.35059C10.9313 1.247 11.0084 1.158 11.1074 1.0957C11.2065 1.03342 11.3233 0.999939 11.4424 1H16.2607ZM19.3975 6.21777C20.987 6.21794 22.2762 7.43388 22.2764 8.93359V9.71777C22.2764 10.0999 22.1925 10.4724 22.0264 10.8252L21.9648 10.9629H16.8311L16.7686 10.8252C16.6025 10.4724 16.5195 10.0999 16.5195 9.71777V8.93359C16.5197 7.43393 17.808 6.21802 19.3975 6.21777Z"/>
                </g>
                <defs>
                  <clipPath id="clip0_1691_107866">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[4vw] md:text-[16px]">Game History</span>
            </Link>

            <Link href={'/saved-mistakes'} className={`flex items-center gap-[8px] w-[50%] lg:max-w-fit justify-center py-[12px] px-[24px] lg:rounded-t-[12px] bg-[#ECF4FF]`}>        
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" fill="#2E2E2E" d="M6.34797 0V3.17611H9.51815V0H6.34797ZM15.8661 3.17611V5.59056C16.0106 5.68958 16.1474 5.79621 16.2842 5.90284C16.3071 5.91808 16.3299 5.93331 16.3451 5.94854C16.4971 6.07041 16.6492 6.20751 16.786 6.3446H19.0287V3.16849H15.8585L15.8661 3.17611ZM12.6883 0V3.17611H15.8585V0H12.6883ZM0 0V3.17611H3.17018V0H0ZM0 15.8958H3.17018V12.7197H0V15.8958ZM0 9.53595H3.17018V6.35984H0V9.53595ZM9.51815 5.01932C9.91347 4.84414 9.90967 5.26254 10.343 5.17114C10.5675 5.72665 10.5447 5.72665 10.9894 5.17114C11.1871 5.13306 10.7615 5.04217 10.9591 5.01932C10.5679 5.01983 11.6359 5.68146 11.6359 5.17114C11.864 5.14829 11.9205 5.17114 12.1562 5.17114C12.331 5.17114 12.5135 5.00409 12.6883 5.01932V3.19134H9.51815V5.02694V5.01932ZM6.66204 12.7121C6.5404 12.2017 6.46438 11.6686 6.46438 11.1202C6.46438 10.5718 6.5404 10.0386 6.66204 9.52833H3.17778V12.7044H6.66204V12.7121ZM6.84212 7.14434C6.84212 7.14434 6.88774 7.08341 6.91054 7.04533C7.1006 6.8016 7.30586 6.5731 7.52633 6.35222H6.34037V7.89838C6.48481 7.6318 6.65967 7.38046 6.84212 7.13673V7.14434ZM3.17778 6.35984H6.34797V3.18373H3.17778V6.35984Z"/>
                <path fill="#2E2E2E" d="M19.7045 7.67563L17.208 5.17924C17.1033 5.07374 16.9787 4.9901 16.8414 4.93318C16.7041 4.87626 16.5569 4.84719 16.4083 4.84766H7.5922C7.29217 4.84766 7.00443 4.96684 6.79228 5.17898C6.58012 5.39112 6.46094 5.67884 6.46094 5.97885V17.2907C6.46094 17.5907 6.58012 17.8785 6.79228 18.0906C7.00443 18.3027 7.29217 18.4219 7.5922 18.4219H18.9049C19.2049 18.4219 19.4926 18.3027 19.7048 18.0906C19.9169 17.8785 20.0361 17.5907 20.0361 17.2907V8.47524C20.0366 8.32663 20.0075 8.17942 19.9506 8.04215C19.8937 7.90488 19.81 7.78029 19.7045 7.67563ZM18.9049 17.2907H17.208V13.3316C17.208 13.0316 17.0888 12.7438 16.8766 12.5317C16.6645 12.3196 16.3767 12.2004 16.0767 12.2004H10.4204C10.1203 12.2004 9.8326 12.3196 9.62044 12.5317C9.40829 12.7438 9.2891 13.0316 9.2891 13.3316V17.2907H7.5922V5.97885H16.4083L18.9049 8.47524V17.2907ZM15.5111 7.67563C15.5111 7.82564 15.4515 7.9695 15.3454 8.07557C15.2393 8.18164 15.0954 8.24123 14.9454 8.24123H10.986C10.836 8.24123 10.6921 8.18164 10.586 8.07557C10.48 7.9695 10.4204 7.82564 10.4204 7.67563C10.4204 7.52563 10.48 7.38177 10.586 7.2757C10.6921 7.16963 10.836 7.11004 10.986 7.11004H14.9454C15.0954 7.11004 15.2393 7.16963 15.3454 7.2757C15.4515 7.38177 15.5111 7.52563 15.5111 7.67563Z"/>
              </svg>
              <span className="text-[4vw] md:text-[16px]">Saved Mistakes</span>
            </Link>
          </div>

          <div className="flex justify-between items-center xl:mb-4 pt-[16px] lg:pt-0">
            <div className="hidden lg:flex flex-row items-center gap-1 md:gap-2">
              <h1 className="text-[14px] --sm md:text-2xl xl:text-[32px] font-bold">
                My Game History

                {isUsernameFetching ? (
                  <LoadingDot />
                ) : (
                  <sub className="text-[14px] --xs text-gray-500 font-normal lg:text-[18px]">
                    {isTutorialPlay
                      ? dataTutorial.username
                      : username
                      ? `(${username})`
                      : "(No username set)"}
                  </sub>
                )}
              </h1>
            </div>

            <ImportDialogButton />
          </div>

          {!username && 
            <AccountNotConnected onClick={() => { 
               setOpenAccountConnected(true);
            }} />}

          <StatisticsSection username={username} />
        </div>
        
        <GameHistoriesTable />

        {/* <HistoryTabs username={username} /> */}
      </main>
    </>
  );
};

export default GameHistoryPage;
