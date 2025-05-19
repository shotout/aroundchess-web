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

interface OpeningTooltipProps {
  content: string;
  className?: string;
  tooltipClassName?: string;
  categoryId?: string;
}

const OpeningTooltip: React.FC<OpeningTooltipProps> = ({
  content,
  className = "",
  tooltipClassName = "",
  categoryId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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
      <p className="text-black font-medium">{content}</p>
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
