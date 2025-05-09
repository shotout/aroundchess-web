import React from "react";
import ResourceSection from "./ResourcesSection";

interface PracticeSectionProps {
  resources: any | undefined | unknown;
  title: string;
}

const PracticeSection: React.FC<PracticeSectionProps> = ({
  resources,
  title,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ResourceSection resources={resources} title={title} />
    </div>
  );
};

export default PracticeSection;
