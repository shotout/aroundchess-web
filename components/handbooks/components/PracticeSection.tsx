import React from "react";

interface Resource {
  title: string;
  description?: string;
  url: string;
  platform?: string;
}

interface PracticeSectionProps {
  resources?: Resource[];
}

const PracticeSection: React.FC<PracticeSectionProps> = ({ resources }) => {
  return (
    <div className="border rounded-lg p-4 bg-light-40">
      <h3 className="font-semibold text-sm mb-4">
        Practice your Learnings to finish this Lesson:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources && resources.length > 0 ? (
          resources.map((resource, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex flex-col h-40 bg-white"
            >
              <h4 className="font-medium text-sm">{resource.title}</h4>
              <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                {resource.description}
              </p>
              <div className="flex justify-center items-center w-full mt-auto pt-4">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-base text-sm hover:underline block btn-tertiary w-full rounded-full"
                >
                  <h1 className="text-center text-md font-semibold">
                    Visit{" "}
                    {resource.platform
                      ? resource.platform.replace("_", ".")
                      : "resource"}
                  </h1>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border">
            <p>No resources available for this lesson.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeSection;
