import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LessonHeaderProps {
  title: string;
  description?: string;
  basePath: string;
  router: AppRouterInstance;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  description,
  basePath,
  router,
}) => {
  return (
    <div className="mb-4">
      <div className="px-4 pt-20 pb-3 md:px-6 md:pt-24 md:pb-4 lg:pt-28 xl:pt-6 xl:gap-y-2">
        <div className="flex">
          <div className="flex items-center">
            <button
              onClick={() => router.push(basePath)}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-6 w-6 mr-2 font-bold" />
            </button>
            <h1 className="font-bold text-lg xl:text-[32px]">{title}</h1>
          </div>
          <div className="hidden"></div>
        </div>

        <p className="text-gray-600 text-xs text-justify md:text-sm md:text-left md:mt-1 ml-8 xl:text-lg">
          {description}
        </p>
      </div>
      <div className="border-b xl:border-b-0"></div>
    </div>
  );
};

export default LessonHeader;
