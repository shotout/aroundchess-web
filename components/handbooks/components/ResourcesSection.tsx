import React from "react";
import { Play } from "lucide-react";

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
  const handleDiscord = () => {
    const discordUrl = `https://discord.gg/PZWcXsxGM7`;
    window.open(discordUrl, "_blank");
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-light-40">
        <h3 className="font-semibold text-[14px] --sm mb-4">{title}:</h3>
        <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border bg-white rounded-lg">
          <p className="text-center">
            New Data for this lesson is coming soon,{" "}
            <a
              onClick={handleDiscord}
              className="text-blue-base cursor-pointer"
            >
              join our Discord
            </a>{" "}
            community to get the latest news
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-light-40 border-[#2780f8]">
      <h3 className="font-semibold text-[14px] --sm mb-4">{title}:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="border rounded-lg p-4 flex flex-col h-[200px] bg-white"
          >
            <h4 className="font-medium text-[14px] --sm">{title}</h4>
            {resource.description && (
              <div className="overflow-y-auto flex-grow mt-2 pr-2">
                <p className="text-[14px] --xs text-gray-600 whitespace-pre-line">
                  {resource.description}
                </p>
              </div>
            )}
            <div className="flex justify-center items-center w-full mt-auto pt-4 gap-2">
              {resource.videoUrl && (
                <a
                  href={resource.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-base text-[14px] --sm hover:underline block btn-tertiary w-1/2 rounded-full"
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
                className="text-blue-base text-[14px] --sm hover:underline block btn-tertiary w-full rounded-full"
              >
                <h1 className="text-center text-md font-semibold flex items-center justify-center">
                  Visit {getPlatformName(resource.url)}
                </h1>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getPlatformName = (url: string): string => {
  if (url.includes("chess.com")) return "Chess.com";
  if (url.includes("lichess.org")) return "Lichess";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("chessable.com")) return "Chessable";

  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return (
      domain.split(".")[0].charAt(0).toUpperCase() +
      domain.split(".")[0].slice(1)
    );
  } catch {
    return "Resource";
  }
};

export default ResourceSection;
