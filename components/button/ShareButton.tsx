"use client";

import { useState } from "react";
import {
  Share2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  LinkIcon,
  MailIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { GrThreads } from "react-icons/gr";
import Image from "next/image";

const ShareButton = (props: any) => {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState([
    {
      name: "link",
      onPress: null,
    },
    {
      name: "mail",
      onPress: null,
    },
    {
      name: "discord",
      onPress: null,
    },
    {
      name: "facebook-circle",
      onPress: null,
    },
    {
      name: "whatsapp",
      onPress: null,
    },
    {
      name: "threads",
      onPress: null,
    },
  ]);
  const renderIconRow = () => {
    return (
      <div className="flex flex-row items-end gap-4">
        {icon.map((item: any, index: number) => {
          return (
            <button key={index}>
              <Image
                src={`/icons/${item.name}.png`}
                alt={""}
                width={1000}
                height={1000}
                className="w-4 h-4 sm:w-5 sm:h-5  object-contain"
              />
            </button>
          );
        })}
      </div>
    );
  };
  const renderIcon = () => {
    return (
      <div className="flex flex-row gap-4 p-3">
        {icon.map((item: any, index: number) => {
          return (
            <button key={index}>
              <Image
                src={`/icons/${item.name}.png`}
                alt={""}
                width={1000}
                height={1000}
                className="w-4 h-4 sm:w-5 sm:h-5  object-contain"
              />
            </button>
          );
        })}
      </div>
    );
  };
  return (
    <div className="flex flex-row relative items-center justify-center gap-2">
      {/* Button with inner shadow */}
      <div
        onClick={props.isFull ? () => null : () => setOpen(!open)}
        className="flex flex-row justify-between w-full items-center gap-2 px-4 py-2 rounded-xl border border-[#C6EEFE] bg-[#E6F7FE] text-black font-medium  "
        style={{
          boxShadow: `inset 0px -2px 2px #C6EEFE,
          inset 0px 2px 0px #FFFFFF`, // Custom inner shadow
        }}
      >
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
          <span className="text-xs sm:text-sm md:text-md">
            Share this article:
          </span>
        </div>
        {props.isFull ? null : !open ? (
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
        ) : (
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
        )}
        {props.isFull && renderIconRow()}
      </div>
      <button
        onClick={() => props.save()}
        className="flex items-center gap-2 px-2 py-2 rounded-xl border border-[#C6EEFE] bg-[#E6F7FE] text-black font-medium  "
        style={{
          boxShadow: `inset 0px -2px 2px #C6EEFE,
          inset 0px 2px 0px #FFFFFF`, // Custom inner shadow
        }}
      >
        <Bookmark className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
      </button>
      {/* Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -left-4 mt-20 bg-white border border-gray-200 rounded-sm shadow-lg z-10"
        >
          {renderIcon()}
        </motion.div>
      )}
    </div>
  );
};

export default ShareButton;
