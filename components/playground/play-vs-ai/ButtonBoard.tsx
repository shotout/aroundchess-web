import { SettingBoard } from "@/components/modal/SettingBoard";
import Image from "next/image";
interface ButtonBoardProps {
  boardSize: string | number;
  handleSwitch: () => void;
  handleThreeD: () => void;
  is3DMode: boolean;
  onFullscreen?: () => void;
  onFullscreenOverlay?: () => void;
}

export const ButtonBoard = ({
  boardSize,
  handleSwitch,
  handleThreeD,
  is3DMode,
  onFullscreen,
  onFullscreenOverlay,
}: ButtonBoardProps) => {
  return (
    <div
      // style={{ width: boardSize }}
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
      {onFullscreen && (
        <button onClick={onFullscreen} aria-label="Enter fullscreen" className="transition-transform duration-200 hover:scale-125 active:scale-90">
          <Image
            src={"/images/v2/play-vs-ai/open_in_full.png"}
            alt="fullscreen"
            width={36}
            height={36}
            className="w-[20px] h-[20px] object-contain"
          />
        </button>
      )}
      {onFullscreenOverlay && (
        <button
          onClick={onFullscreenOverlay}
          aria-label="Enter fullscreen layout without browser fullscreen (dev)"
          title="Dev: fullscreen layout, browser UI stays"
          className="relative transition-transform duration-200 hover:scale-125 active:scale-90"
        >
          <Image
            src={"/images/v2/play-vs-ai/open_in_full.png"}
            alt="fullscreen dev"
            width={36}
            height={36}
            className="w-[20px] h-[20px] object-contain opacity-60"
          />
          <span className="absolute -top-[7px] -right-[10px] rounded-[3px] bg-[#FF8A00] px-[3px] text-[8px] font-bold leading-[11px] text-white">
            DEV
          </span>
        </button>
      )}
      {/* <button onClick={handleThreeD}>
        <Image
          src={`/icons/${!is3DMode ? `3d-icon` : `2d-icon`}.png`}
          alt="icon"
          width={1000}
          height={1000}
          className="w-[22px] h-[27px] object-contain"
        />
      </button> */}
    </div>
  );
};
