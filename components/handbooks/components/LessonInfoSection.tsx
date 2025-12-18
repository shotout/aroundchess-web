import React from "react";
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
      <li key={index} className="text-[15px] --xs">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[18px] p-[8px] md:p-[0px] md:pb-[8px] --sm">{getPrimaryLabel()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-4">
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
    </div>
  );
};

export default LessonInfoSection;
