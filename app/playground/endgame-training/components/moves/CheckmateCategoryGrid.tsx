import { CheckmateData } from "../../types/EndgameTrainingTypes";
import { CheckmateCategoryItem } from "./CheckmateCategoryItem";

interface CheckmateCategoryGridProps {
  data: CheckmateData | null;
  onCategorySelect: (movesToCheckmate: number) => void;
}

export const CheckmateCategoryGrid: React.FC<CheckmateCategoryGridProps> = ({
  data,
  onCategorySelect,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full">
      {data?.map((positions, index) => (
        <CheckmateCategoryItem
          key={`checkmate-category-${index}`}
          movesToCheckmate={index + 1}
          positionsCount={positions.length}
          onCategorySelect={onCategorySelect}
        />
      ))}
    </div>
  );
};
