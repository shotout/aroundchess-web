"use client";
import GameHistoryPage from "@/components/game-history/GameHistoryPage";

export default function AnalysisPage() {
  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const [isDesktop, setIsDesktop] = useState(false);

  // useEffect(() => {
  //   const checkIfDesktop = () => {
  //     setIsDesktop(window.innerWidth >= 1280);
  //   };

  //   checkIfDesktop();

  //   window.addEventListener("resize", checkIfDesktop);
  //   return () => window.removeEventListener("resize", checkIfDesktop);
  // }, []);

  // const toggleSidebar = () => {
  //   setSidebarOpen(!isSidebarOpen);
  // };
  return (
    <GameHistoryPage />
    // <div className="flex overflow-hidden bg-primary-white">
    //   {/* Desktop sidebar - always visible on desktop */}
    //   {isDesktop && (
    //     <div className="w-64 border-r border-gray-200 bg-white">
    //       <Sidebar />
    //     </div>
    //   )}

    //   <div className="flex flex-col overflow-y-auto w-full">
    //     <Header onSidebarToggle={toggleSidebar} />
    //     <div className="w-full">
    //       <GameHistoryPage />
    //     </div>
    //     <SiteFooterNew />
    //   </div>

    //   {/* Mobile sidebar - only visible when toggled */}
    //   {!isDesktop && isSidebarOpen && (
    //     <>
    //       <div
    //         className="fixed inset-0 bg-black/50 z-40"
    //         onClick={() => setSidebarOpen(false)}
    //       />

    //       {/* Mobile sidebar */}
    //       <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200">
    //         <Sidebar onClose={() => setSidebarOpen(false)} />
    //       </div>
    //     </>
    //   )}
    // </div>
  );
}
