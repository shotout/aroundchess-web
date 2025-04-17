// StageCard.tsx
import React from "react";
import { useRouter } from "next/navigation";

interface StageCardProps {
  stageNumber: number;
  active: boolean;
  categorySlug: string;
  subcategorySlug: string;
  fen?: string; // Optional FEN data to pass
}

const StageCard: React.FC<StageCardProps> = ({
  stageNumber,
  active,
  categorySlug,
  subcategorySlug,
}) => {
  const router = useRouter();

  const handleStageClick = () => {
    // Use the existing route structure with the stage as a parameter
    router.push(
      `/playground/endgame-training/${categorySlug}/${subcategorySlug}/${stageNumber}`
    );
  };

  return (
    <div
      onClick={handleStageClick}
      className={`relative border ${
        active ? "border-blue-600" : "border-gray-200"
      } ${
        active ? "bg-blue-50" : "bg-white"
      } rounded-lg p-3 cursor-pointer hover:shadow-md transition-all h-24 flex items-center justify-center`}
    >
      {/* Top-left corner flag */}
      <div className="absolute top-0 left-0">
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 4C0 1.79086 1.79086 0 4 0H8V8H0V4Z" fill="#29ABE2" />
          <path d="M12 0H20V8H12V0Z" fill="#29ABE2" />
          <path d="M24 0H28C30.2091 0 32 1.79086 32 4V8H24V0Z" fill="#29ABE2" />
          <path d="M32 12V20H24V12H32Z" fill="#29ABE2" />
          <path
            d="M32 24V28C32 30.2091 30.2091 32 28 32H24V24H32Z"
            fill="#29ABE2"
          />
          <path d="M20 32H12V24H20V32Z" fill="#29ABE2" />
          <path d="M8 32H4C1.79086 32 0 30.2091 0 28V24H8V32Z" fill="#29ABE2" />
          <path d="M0 20V12H8V20H0Z" fill="#29ABE2" />
        </svg>
      </div>

      {/* Text content */}
      <div className="text-center">
        <div className="font-semibold text-sm">Stage</div>
        <div
          className={`text-4xl font-bold ${
            active ? "text-blue-600" : "text-blue-400"
          }`}
        >
          {stageNumber}
        </div>
      </div>

      {/* Bottom-right corner design */}
      <div className="absolute bottom-0 right-0">
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          opacity="0.3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32 3C32 1.34315 30.6569 0 29 0H24V8H32V3Z" fill="#29ABE2" />
        </svg>
      </div>
    </div>
  );
};

export default StageCard;
