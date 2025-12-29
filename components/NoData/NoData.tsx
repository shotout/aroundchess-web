import { BookXIcon } from "lucide-react";

export default function NoData({children}:any) {
  return (
    <div className="flex items-center justify-center my-2 gap-2">
      <BookXIcon className="w-4 h-4 md:w-6 md:h-6" />
      <span className="text-center text-[14px] --xs md:text-lg">{children?children:"Data Empty"}</span>
    </div>
  );
}
