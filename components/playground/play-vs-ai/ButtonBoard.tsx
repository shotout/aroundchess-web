import { SettingBoard } from "@/components/modal/SettingBoard";
import Image from "next/image";
interface ButtonBoardProps {
  boardSize: string | number;
  handleSwitch: () => void;
  handleThreeD: () => void;
  is3DMode: boolean;
}

export const ButtonBoard = ({
  boardSize,
  handleSwitch,
  handleThreeD,
  is3DMode,
}: ButtonBoardProps) => {
  return (
    <div
      className="flex flex-row self-end sm:self-center justify-end items-center gap-3 mt-2"
    >
      <button onClick={handleSwitch}>
        <Image
          src={"/images/play-vs-ai/switch.png"}
          alt="icon"
          width={1000}
          height={1000}
          className="w-[20px] h-[20px] rounded-full object-contain"
        />
      </button>
      <SettingBoard />
    </div>
  );
};
