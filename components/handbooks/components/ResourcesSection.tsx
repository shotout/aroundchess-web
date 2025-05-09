import React from "react";
import { ExternalLink, Play } from "lucide-react";

interface Resource {
  id: number;
  handbookId: string;
  title: string;
  url: string;
  videoUrl: string | null;
  platform: string;
  type: string;
  description: string;
}

interface ResourceSectionProps {
  resources: Resource[] | undefined;
  title?: string;
}

const ResourceSection: React.FC<ResourceSectionProps> = ({
  resources,
  title,
}) => {
  if (!resources || resources.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-light-40">
        <h3 className="font-semibold text-sm mb-4">{title}:</h3>
        <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border bg-white rounded-lg">
          <p className="text-center">No Data available for this lesson.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-light-40 border-[#2780f8]">
      <h3 className="font-semibold text-sm mb-4">{title}:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="border rounded-lg  p-4 flex flex-col h-40 bg-white"
          >
            <h4 className="font-medium text-sm">{title}</h4>
            {resource.description && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                {resource.description}
              </p>
            )}
            <div className="flex justify-center items-center w-full mt-auto pt-4 gap-2">
              {resource.videoUrl && (
                <a
                  href={resource.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-base text-sm hover:underline block btn-tertiary w-1/2 rounded-full"
                >
                  <h1 className="text-center text-md font-semibold flex items-center justify-center">
                    <Play className="mr-2 h-4 w-4" />
                    Watch
                  </h1>
                </a>
              )}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-base text-sm hover:underline block btn-tertiary w-full rounded-full"
              >
                <h1 className="text-center text-md font-semibold flex items-center justify-center">
                  Visit {getPlatformName(resource.platform)}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </h1>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getPlatformName = (platform: string): string => {
  const platformMap: Record<string, string> = {
    chess_com: "Chess.com",
    lichess_org: "Lichess.org",
    chessable: "Chessable",
    youtube: "YouTube",
  };

  return platformMap[platform] || platform;
};

export default ResourceSection;
