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
  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  if (!Array.isArray(data)) {
    console.error("Invalid checkmate data format:", data);
    return (
      <div className="text-center py-8">
        Invalid data format - expected an array
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">No checkmate categories available</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {data.map((positions, index) => (
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
