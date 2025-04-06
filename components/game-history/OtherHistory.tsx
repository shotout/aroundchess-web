import OtherGamesTab from "./OtherHistory/OtherGameTab";

const OtherHistory = () => {
  return (
    <div className="w-full">
      <div className="w-full xl:border-b-2 border-[#DEDEDE] mb-4">
        <div className="flex justify-between items-center mb-2 px-4">
          <div className="mb-4 w-full overflow-hidden border-[1px] lg:border-none border-[#DEDEDE]"></div>
        </div>
      </div>
      <OtherGamesTab />
    </div>
  );
};

export default OtherHistory;
