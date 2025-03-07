"use client"
import { SiteFooterNew } from "@/components/site-footer-new";
import AnalysisLatestGame from "./AnalysisLatestGame";
import AnalysisResult from "./AnalysisResult";
import { useEffect, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
export default function AnalysisPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIfDesktop = () => {
          setIsDesktop(window.innerWidth >= 1280);
        };
    
        checkIfDesktop();
    
        window.addEventListener("resize", checkIfDesktop);
        return () => window.removeEventListener("resize", checkIfDesktop);
      }, []);
    
      const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
      };
  return (
    <div className="flex overflow-hidden">
    {/* Desktop sidebar - always visible on desktop */}
    {isDesktop && (
      <div className="w-64 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>
    )}

    {/* Main content */}
    <div className="flex flex-1 flex-col overflow-y-auto">
      <Header onSidebarToggle={toggleSidebar} />
      <main className="flex-1">
        
      <div className="flex flex-col justify-center bg-white px-2 sm:px-4 md:px-6 lg:px-6 pb-2 sm:pb-4 md:pb-6 lg:pb-8">
        <h2 className="text-md pt-4 text-center lg:text-left sm:text-lg md:text-xl lg:text-2xl font-bold">
          Analysis Result from <span className="text-[#4E7838]">Chess.com</span>
        </h2>
        <span className="hidden lg:block text-xs sm:text-sm md:text-md lg:text-lg">
          Discover an Analysis of your latest Chess.com Game.
        </span>
        <div className="hidden lg:block text-xs sm:text-sm md:text-md lg:text-lg">
          AI-powered chess analysis provides deep insights into positional and
          tactical aspects of a game. It evaluates piece coordination, pawn
          structure, king safety, and overall positional advantages, helping
          players understand strategic strengths and weaknesses
        </div>
      </div>
      <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white px-4">
        <AnalysisResult />
        <AnalysisLatestGame />
      </div>
      <SiteFooterNew />
      </main>
    </div>

    {/* Mobile sidebar - only visible when toggled */}
    {!isDesktop && isSidebarOpen && (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile sidebar */}
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </>
    )}

  </div>
  );
}
