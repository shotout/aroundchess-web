import React, { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChessLesson, LessonType } from "../ChessLessonTypes";

interface LessonInfoSectionProps {
  lesson: ChessLesson;
  lessonType: LessonType;
}

interface IdeaItem {
  idea?: string;
}

const LessonInfoSection: React.FC<LessonInfoSectionProps> = ({
  lesson,
  lessonType,
}) => {
  let primaryItems: string[] = [];
  let secondaryItems: string[] = [];

  if (lesson.strategicIdeas && Array.isArray(lesson.strategicIdeas)) {
    primaryItems = lesson.strategicIdeas.map(
      (item: IdeaItem) => item.idea || ""
    );
  }

  if (lesson.tacticalIdeas && Array.isArray(lesson.tacticalIdeas)) {
    secondaryItems = lesson.tacticalIdeas.map(
      (item: IdeaItem) => item.idea || ""
    );
  }

  const getPrimaryLabel = (): string => {
    return "Strategic Ideas:";
  };

  const getSecondaryLabel = (): string => {
    return "Tactical Ideas:";
  };

  const getAnalysisLabel = (): string => {
    return `${
      lessonType.charAt(0).toUpperCase() + lessonType.slice(1)
    } Analysis`;
  };

  const renderSafeList = (items: string[]): React.ReactNode => {
    if (!items || items.length === 0) {
      return <li className="text-[15px] --xs">Content coming soon</li>;
    }
    return items.map((item, index) => (
      <li key={index} className="relative text-[14px] pl-[18px] pb-[8px] md:pb-0 mb-[8px] md:mb-0 md:pl-0 md:text-[15px] border-b border-[#DEDEDE] last:border-b-0 last:mb-0 md:border-b-0 --xs text-[#364152]">  
        <svg width="10" height="16" className="absolute left-0 top-[4px] md:hidden" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.086 11.8236C7.21204 11.8236 7.31419 11.9257 7.31419 12.0516V13.5994C7.31419 13.7253 7.21204 13.8279 7.086 13.8279H6.56094C6.42416 14.6397 5.71931 15.2594 4.86812 15.2594C4.01751 15.2594 3.31266 14.6397 3.17587 13.8279H2.65081C2.52478 13.8279 2.42263 13.7253 2.42263 13.5994V12.0516C2.42263 11.9257 2.52478 11.8236 2.65081 11.8236H7.086ZM5.09688 0.00535386C8.04233 0.137006 10.348 2.96985 9.59061 6.05208C9.41499 6.74039 9.07751 7.38049 8.64325 7.9424C8.08594 8.66027 7.70066 9.35384 7.46113 10.0716L7.36375 10.3597C7.31477 10.5014 7.18755 10.5944 7.0412 10.5944H2.69382C2.54747 10.5944 2.42025 10.5014 2.37186 10.3597L2.27389 10.0716C2.03436 9.33902 1.62937 8.62115 1.04817 7.87849C0.242366 6.85776 -0.114242 5.60277 0.0321047 4.28392C0.130067 3.42442 0.466973 2.59395 0.999196 1.90995C2.0051 0.615887 3.50499 -0.0680582 5.09688 0.00535386ZM8.34518 5.23649C8.44314 4.35214 8.20839 3.50739 7.67139 2.78426C7.13857 2.07116 6.3716 1.58751 5.52159 1.42629C5.25817 1.37767 4.99952 1.54844 4.95054 1.81216C4.90156 2.0812 5.07239 2.33495 5.33641 2.38363C5.95167 2.50095 6.5036 2.85248 6.88948 3.37048C7.27535 3.88801 7.4468 4.49854 7.3781 5.13392C7.34884 5.40248 7.53938 5.64142 7.80758 5.67099H7.86134C8.11042 5.67099 8.32069 5.48546 8.34518 5.23649Z" fill="#2780F8"/>
        </svg>

        {item}
      </li>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-blue-base border-l-4 rounded-lg p-4 flex flex-col h-[78px] xl:gap-y-1">
        <div className="flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-base">{getAnalysisLabel()}</h2>
        </div>
        <p className="text-[#364152] text-[14px] --sm">
          Key concepts and ideas in this {lessonType}
        </p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[18px] p-[8px] md:p-[0px] md:pb-[8px] --sm">{getPrimaryLabel()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 md:list-disc pl-4">
              {renderSafeList(primaryItems)}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[18px] p-[8px] md:p-[0px] md:pb-[8px] --sm">{getSecondaryLabel()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-4">
              {renderSafeList(secondaryItems)}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Accordion key={"primary"} title={getPrimaryLabel()} content={renderSafeList(primaryItems)} />
        <Accordion key={"second"} title={getSecondaryLabel()} content={renderSafeList(secondaryItems)} />
      </div>
    </div>
  );
};

const Accordion = ({key, title, content}: {key: string, title: string, content: React.ReactNode}) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClicked = () => {
    setOpen(!open);  
  }

  return (
    <div className="border border-[#DEDEDE] rounded-[4px] mb-[8px]">
      <button onClick={handleClicked} type="button" className="w-full flex p-[8px] items-center justify-between">
        <span className="text-[16px] font-semibold">{title}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={open ? "rotate-180" : ""}>
          <path d="M3.08431 8.16256L9.33431 14.4126C9.42141 14.5 9.5249 14.5693 9.63886 14.6166C9.75281 14.6639 9.87499 14.6883 9.99838 14.6883C10.1218 14.6883 10.2439 14.6639 10.3579 14.6166C10.4718 14.5693 10.5753 14.5 10.6624 14.4126L16.9124 8.16257C17.0886 7.98644 17.1875 7.74757 17.1875 7.4985C17.1875 7.24943 17.0886 7.01056 16.9124 6.83444C16.7363 6.65832 16.4974 6.55938 16.2484 6.55938C15.9993 6.55938 15.7604 6.65832 15.5843 6.83444L9.99759 12.4212L4.41088 6.83366C4.23476 6.65754 3.99589 6.55859 3.74681 6.55859C3.49774 6.55859 3.25887 6.65754 3.08275 6.83366C2.90663 7.00978 2.80769 7.24865 2.80769 7.49772C2.80769 7.74679 2.90663 7.98566 3.08275 8.16178L3.08431 8.16256Z" fill="black"/>
        </svg>
      </button>

      {open && (
        <div className="p-[8px]">
          <ul>
            {content}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LessonInfoSection;
