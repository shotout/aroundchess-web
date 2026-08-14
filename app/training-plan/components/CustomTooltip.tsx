import React, { useState, useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomInfoTooltipProps {
  content: string;
  className?: string;
  tooltipClassName?: string;
}

const CustomInfoTooltip: React.FC<CustomInfoTooltipProps> = ({
  content,
  className = "",
  tooltipClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);

    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  useEffect(() => {
    if (!isOpen || !isTouchDevice) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, isTouchDevice]);

  const handleClick = () => {
    if (isTouchDevice) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsOpen(false);
    }
  };

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

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`focus:outline-none`}
        aria-label="Show info"
        type="button"
      >
        <AlertCircle className="text-blue-base" />
      </button>

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
              <div className="flex gap-3">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-blue-base w-5 h-5" />
                  </div>
                </div>
                <p className="text-black font-medium">{content}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomInfoTooltip;
