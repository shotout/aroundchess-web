import React, { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { usePgnStore } from "@/app/store/zustandStore";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/playground/src/Components/ui/dialog";

interface OpeningTooltipProps {
  content?: string;
  categoryId?: string;
  openingNames?: string[] | string;
}

interface OpeningData {
  opening_name: string;
  total_game: number;
}

interface OpeningsByColor {
  white: OpeningData[];
  black: OpeningData[];
}

type LegacyOpeningData = OpeningData[];

type OpeningPlayedData = OpeningsByColor | LegacyOpeningData | null | undefined;

const OpeningTooltip: React.FC<OpeningTooltipProps> = ({
  content = "",
  categoryId,
  openingNames,
}) => {
  const { openingPlayed } = usePgnStore();
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMobileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileDialogOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsPopoverOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Add a small delay before closing to prevent flickering
      hoverTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpen(false);
      }, 100);
    }
  };

  const getRelevantOpenings = () => {
    if (!openingPlayed) {
      return { white: [], black: [] };
    }

    let whiteOpenings: { name: string; playCount: number }[] = [];
    let blackOpenings: { name: string; playCount: number }[] = [];

    const namesArray = Array.isArray(openingNames)
      ? openingNames
      : openingNames
      ? [openingNames]
      : [];

    const hasColorCategories =
      openingPlayed &&
      typeof openingPlayed === "object" &&
      !Array.isArray(openingPlayed) &&
      ("white" in openingPlayed || "black" in openingPlayed);

    if (hasColorCategories) {
      const coloredData = openingPlayed as OpeningsByColor;

      if (Array.isArray(coloredData.white)) {
        if (namesArray.length === 0) {
          whiteOpenings = coloredData.white
            .map((opening) => ({
              name: opening.opening_name,
              playCount: opening.total_game,
            }))
            .filter((opening) => opening.playCount > 0)
            .sort((a, b) => b.playCount - a.playCount);
        } else {
          whiteOpenings = namesArray
            .map((openingName) => {
              const matchingOpening = coloredData.white?.find(
                (opening) => opening.opening_name === openingName
              );
              return {
                name: openingName,
                playCount: matchingOpening ? matchingOpening.total_game : 0,
              };
            })
            .filter((opening) => opening.playCount > 0)
            .sort((a, b) => b.playCount - a.playCount);
        }
      }

      if (Array.isArray(coloredData.black)) {
        if (namesArray.length === 0) {
          blackOpenings = coloredData.black
            .map((opening) => ({
              name: opening.opening_name,
              playCount: opening.total_game,
            }))
            .filter((opening) => opening.playCount > 0)
            .sort((a, b) => b.playCount - a.playCount);
        } else {
          blackOpenings = namesArray
            .map((openingName) => {
              const matchingOpening = coloredData.black?.find(
                (opening) => opening.opening_name === openingName
              );
              return {
                name: openingName,
                playCount: matchingOpening ? matchingOpening.total_game : 0,
              };
            })
            .filter((opening) => opening.playCount > 0)
            .sort((a, b) => b.playCount - a.playCount);
        }
      }
    } else if (Array.isArray(openingPlayed)) {
      const legacyOpenings = openingPlayed as LegacyOpeningData;

      const processedOpenings =
        namesArray.length === 0
          ? legacyOpenings
              .map((opening) => ({
                name: opening.opening_name,
                playCount: opening.total_game,
              }))
              .filter((opening) => opening.playCount > 0)
              .sort((a, b) => b.playCount - a.playCount)
          : namesArray
              .map((openingName) => {
                const matchingOpening = legacyOpenings.find(
                  (opening) => opening.opening_name === openingName
                );
                return {
                  name: openingName,
                  playCount: matchingOpening ? matchingOpening.total_game : 0,
                };
              })
              .filter((opening) => opening.playCount > 0)
              .sort((a, b) => b.playCount - a.playCount);

      whiteOpenings = processedOpenings;
    }

    return { white: whiteOpenings, black: blackOpenings };
  };

  const relevantOpenings = getRelevantOpenings();
  const hasAnyOpenings =
    relevantOpenings.white.length > 0 || relevantOpenings.black.length > 0;

  const tooltipContent = (
    <div className="flex gap-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <div className="flex-shrink-0 flex items-start pt-1">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
          <AlertCircle className="text-blue-base w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        {content && (
          <p className="text-gray-900 font-medium text-xs sm:text-sm mb-2 leading-relaxed">
            {content}
          </p>
        )}
        {hasAnyOpenings ? (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-medium text-gray-800">
              List of Topics that you've played:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* White openings */}
              {relevantOpenings.white.length > 0 && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 tracking-wide mb-1">
                    White Opening
                  </p>
                  <div className="space-y-1">
                    {relevantOpenings.white.map((opening, index) => (
                      <p
                        key={`white-${index}`}
                        className="text-xs sm:text-sm text-gray-700 leading-snug"
                      >
                        <span className="break-words">{opening.name}</span> ={" "}
                        {opening.playCount}{" "}
                        <span className="font-bold">Times</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Black openings */}
              {relevantOpenings.black.length > 0 && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 tracking-wide mb-1">
                    Black Opening
                  </p>
                  <div className="space-y-1">
                    {relevantOpenings.black.map((opening, index) => (
                      <p
                        key={`black-${index}`}
                        className="text-xs sm:text-sm text-gray-700 leading-snug"
                      >
                        <span className="break-words">{opening.name}</span> ={" "}
                        {opening.playCount}{" "}
                        <span className="font-bold">Times</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">
            No openings have been played yet.
          </p>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          ref={triggerRef}
          onClick={handleMobileClick}
          className="focus:outline-none"
          aria-label="Show info"
          type="button"
        >
          {categoryId === "opening" && (
            <Image
              src="/training-plan/opening-check.png"
              alt="opening checks"
              width={25}
              height={25}
              className="cursor-pointer"
            />
          )}
        </button>

        <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
          <DialogContent className="w-11/12 max-w-sm rounded-lg border border-[#DEDEDE] bg-[#E6F7FE]">
            <DialogHeader className="space-y-0 pb-2">
              <DialogTitle className="sr-only">Information</DialogTitle>
            </DialogHeader>
            {tooltipContent}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop version with hover
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          className="rounded-sm focus:outline-none"
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Show info"
        >
          {categoryId === "opening" && (
            <Image
              src="/training-plan/opening-check.png"
              alt="opening checks"
              width={25}
              height={25}
              className="cursor-pointer"
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="p-3 sm:p-4 bg-blue-base/15 backdrop-blur-3xl border border-blue-base w-auto rounded-none rounded-t-md rounded-br-md"
        sideOffset={10}
        alignOffset={10}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {tooltipContent}
      </PopoverContent>
    </Popover>
  );
};

export default OpeningTooltip;
