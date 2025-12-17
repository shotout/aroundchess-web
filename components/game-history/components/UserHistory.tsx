import GamesTab from "./user-history/GamesTab";
import Analytics from "./user-history/Analytics";
import Performance from "./user-history/Performance";
import { usePgnStore } from "@/app/store/zustandStore";

const UserHistory: React.FC = () => {
  const Tabs = ["Analytics", "Performance"] as const;
  const { tab, setTab } = usePgnStore();

  return (
    <div className="w-full">
      <div className="w-full xl:border-b border-[#DEDEDE] xl:mb-4">
        <div className="flex justify-between items-center xl:px-4">
          <div className="mb-4 w-full overflow-hidden lg:rounded-md md:bg-transparent lg:border-[1px] md:border-none lg:border-[#DEDEDE]">
            <div className="flex justify-center items-center h-12 text-[14px] --xs lg:text-[14px] --sm px-2 p-0 md:p-4 xl:p-0">
              {Tabs.map((t, index) => (
                <button
                  key={index}
                  onClick={() => setTab(t)}
                  className={`flex-1 bg-transparent text-center py-2 mx-auto rounded-md font-semibold ${
                    tab === t
                      ? " text-black border border-[#DEDEDE] shadow-card"
                      : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:p-4">
        {tab === "Games" && <GamesTab />}
        {tab === "Analytics" && <Analytics />}
        {tab === "Performance" && <Performance />}
      </div>
    </div>
  );
};

export default UserHistory;
