import React, { useState, useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePgnStore } from "@/app/store/zustandStore";

interface OpeningTooltipProps {
  content?: string;
  className?: string;
  tooltipClassName?: string;
  categoryId?: string;
  openingNames?: string[] | string; // Can be array or single string
}

const OpeningTooltip: React.FC<OpeningTooltipProps> = ({
  content = "",
  className = "",
  tooltipClassName = "",
  categoryId,
  openingNames, // Can be array or single string
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { openingPlayed } = usePgnStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Function to get relevant openings with their play counts
  const getRelevantOpenings = () => {
    if (!openingPlayed) {
      return [];
    }

    // Convert openingNames to array if it's a string
    const namesArray = Array.isArray(openingNames)
      ? openingNames
      : openingNames
      ? [openingNames]
      : [];

    if (namesArray.length === 0) {
      // If no specific openings provided, show all openings
      return openingPlayed
        .map((opening) => ({
          name: opening.opening_name,
          playCount: opening.total_game,
        }))
        .filter((opening) => opening.playCount > 0)
        .sort((a, b) => b.playCount - a.playCount);
    }

    // Filter by provided opening names
    return namesArray
      .map((openingName) => {
        const matchingOpening = openingPlayed.find(
          (opening) => opening.opening_name === openingName
        );
        return {
          name: openingName,
          playCount: matchingOpening ? matchingOpening.total_game : 0,
        };
      })
      .filter((opening) => opening.playCount > 0) // Only show openings that have been played
      .sort((a, b) => b.playCount - a.playCount); // Sort by play count (highest first)
  };

  const relevantOpenings = getRelevantOpenings();

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const triggerButton = (
    <button
      ref={triggerRef}
      onClick={() => setIsOpen(!isOpen)}
      className={`focus:outline-none`}
      aria-label="Show info"
      type="button"
    >
      {categoryId === "opening" && (
        <Image
          src={"/training-plan/opening-check.png"}
          alt="opening checks"
          width={25}
          height={25}
          className="cursor-pointer"
        />
      )}
    </button>
  );

  const tooltipContent = (
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <AlertCircle className="text-blue-base w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {content && <p className="text-black font-medium">{content}</p>}
        {relevantOpenings.length > 0 ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800">
              Openings you've played:
            </p>
            {relevantOpenings.map((opening, index) => (
              <p key={index} className="text-sm text-gray-700">
                {opening.name} = {opening.playCount} times played
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No openings have been played yet.
          </p>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-11/12 max-w-sm rounded-lg border border-[#DEDEDE] bg-[#E6F7FE] ">
            <DialogHeader className="space-y-0 pb-2">
              <DialogTitle className="sr-only">Information</DialogTitle>
            </DialogHeader>
            {tooltipContent}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop version with original popover behavior
  return (
    <div className="relative inline-block">
      {triggerButton}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            className={className}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tooltipVariants}
          >
            <div
              className={` ${tooltipClassName} w-full border border-blue-base shadow-md backdrop-blur-3xl bg-blue-base/5`}
            >
              {tooltipContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpeningTooltip;
