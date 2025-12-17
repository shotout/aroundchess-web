import GamesTab from "./user-history/GamesTab";
import Analytics from "./user-history/Analytics";
import Performance from "./user-history/Performance";
import { usePgnStore } from "@/app/store/zustandStore";

const UserStatisticHistory: React.FC = () => {
  const Tabs = ["Analytics", "Performance"] as const;
  const { tab, setTab } = usePgnStore();

  return (
    <div className="w-full">
      <div className="hidden md:flex w-full p-[16px]">
        <div className="flex rounded-[12px] items-center p-[8px] border border-[#F4F4F4] bg-[#F9FAFC]">
          {Tabs.map((t, index) => (
            <button
              key={index}
              onClick={() => setTab(t)}
              className={`flex text-center py-[8px] px-[16px] rounded-[6px] text-[14px] font-semibold transition-all ${
                tab === t
                  ? 'bg-white text-black border border-[#DEDEDE] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)]'
                  : 'bg-transparent text-gray-600 hover:text-black'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="flex md:hidden w-full border-t border-b border-[#C0CED4]">
        {Tabs.map((t, index) => (
          <button
            key={index}
            onClick={() => setTab(t)}
            className={`flex-1 text-center py-[8px] px-[16px] text-[14px] font-semibold transition-all ${
              tab === t
                ? 'text-[#221AE9] border-b-[2px] border-[#221AE9]'
                : 'bg-transparent text-gray-600'
            }`}
          >{t}</button>
        ))}
      </div>

      <div className="xl:px-4 xl:mb-4">
        {tab === "Analytics" && <Analytics />}
        {tab === "Performance" && <Performance />}
      </div>
    </div>
  );
};

export default UserStatisticHistory;
