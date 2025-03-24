import { BookXIcon } from "lucide-react";

export default function NoData() {
  return (
    <div className="flex items-center justify-center my-2 gap-2">
      <BookXIcon className="w-6 h-6" />
      <span className="text-center text-lg">No Data</span>
    </div>
  );
}
