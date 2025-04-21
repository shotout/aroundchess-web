import Image from "next/image";
import { FC } from "react";
type CurrentInfoProps = {
  textButton: string;
  image: string;
  title: string;
  children: React.ReactNode;
};

const CurrentInfo: FC<CurrentInfoProps> = ({
  children,
  image,
  title,
  textButton,
}) => {
  return (
    <div
      className={`relative overflow-visible z-50 flex flex-col items-center w-[264px] gap-2 border-2 border-[#221AE9] rounded-[8px] p-[16px] bg-[#E6F7FE]`}
    >
      <Image
        alt="icon"
        src={image}
        width={122}
        height={120}
        className="object-contain"
      />
      {/* here is image offside */}
       <Image
        alt="icon"
        src={image}
        width={122}
        height={120}
        className="opacity-10 z-2 absolute -bottom-0 -right-0 object-contain"
      />
      <span className="font-normal text-[14px]">{title}</span>
      {children}
      <button className="btn-primary rounded-full w-full h-[40px]">{textButton}</button>
    </div>
  );
};

export default CurrentInfo;
