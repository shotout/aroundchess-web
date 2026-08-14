import Image from "next/image";
import { FC } from "react";
type CurrentInfoProps = {
  textButton: string | null;
  image: string;
  title: string;
  children: React.ReactNode;
  handleOnClick: () => void;
};

const CurrentInfo: FC<CurrentInfoProps> = ({
  children,
  image,
  title,
  textButton,
  handleOnClick,
}) => {
  return (
    <div
      className={`relative overflow-visible z-10 flex flex-col items-center w-[264px] gap-2 border-2 border-[#221AE9] rounded-[8px] p-[16px] bg-[#E6F7FE]`}
    >
      <Image
        alt="icon"
        src={image}
        width={122}
        height={120}
        className="object-contain"
      />
      <Image
        alt="icon"
        src={image}
        width={122}
        height={120}
        className="opacity-10 z-2 absolute -bottom-0 -right-0 object-contain"
      />
      <span className="font-normal text-[14px]">{title}</span>
      {children}
      {textButton && (
        <button
          onClick={handleOnClick}
          className="btn-primary rounded-full w-full h-[40px]"
        >
          {textButton}
        </button>
      )}
    </div>
  );
};

export default CurrentInfo;
