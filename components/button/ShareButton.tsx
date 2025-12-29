"use client";

import { useEffect, useRef, useState } from "react";
import {
  Share2,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from "lucide-react";
import { motion } from "framer-motion";
import { BookmarkFilledIcon,  } from "@radix-ui/react-icons";
import Image from "next/image";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "../game-history/Spinner";
import { toast } from "sonner";
import { useProfileStore } from "@/app/store/profile";

function useOutsideClicked(ref: any, callback: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

const ShareButton = (props: any) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
   const { sessionId } = useProfileStore();

  const wrapperRef = useRef(null);

  useOutsideClicked(wrapperRef, () => {
    setOpen(false)
  })

  useEffect(() => {
    const checkSession = () => {
      if (sessionId != "") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);

  const [open, setOpen] = useState(false);
  const { isLoading } = useApiClient();
  const [shareUrl, setShareUrl] = useState(
    window?.location?.hostname + "/chess-news/" + props.slug
  );
  const shareTitle = props.title;
  useEffect(() => {
    setShareUrl(window?.location?.hostname + "/chess-news/" + props.slug);
  });
  const [icon, setIcon] = useState([
    {
      name: "link",
      onPress: () => {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            toast.success("Link copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy link");
          });
      },
    },
    {
      name: "mail",
      onPress: () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`Check out this link: ${shareUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
      },
    },
    {
      name: "discord",
      onPress: () => {
        // Discord doesn't have a direct share URL, but users can copy and paste
        // Some Discord bots support webhooks, but for basic sharing:
        window.open(`https://discord.gg/PZWcXsxGM7`, "_blank");
        // After opening Discord, show a toast prompting to paste the link
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => toast.success("Link copied! Now paste it in Discord."))
          .catch((err) => toast.error("Failed to copy link for Discord"));
      },
    },
    {
      name: "facebook-circle",
      onPress: () => {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        window.open(fbShareUrl, "_blank", "width=600,height=400");
      },
    },
    {
      name: "whatsapp",
      onPress: () => {
        const text = encodeURIComponent(`${shareTitle} ${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
      },
    },
    {
      name: "threads",
      onPress: () => {
        // twitter doesn't have a direct web sharing API
        // But we can open twitter and help copy the URL to clipboard
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            toast.success("Link copied! Now paste it in twitter.");
            window.open("https://twitter.com", "_blank");
          })
          .catch((err) => toast.error("Failed to copy link for twitter"));
      },
    },
  ]);
  const renderIconRow = () => {
    return (
      <div className="ml-[3.5vw] flex flex-row items-end gap-3 md:gap-4">
        {icon.map((item: any, index: number) => {
          return (
            <button onClick={item.onPress} key={index}>
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
            <button onClick={item.onPress} key={index}>
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
        ref={wrapperRef}
        onClick={props.isFull ? () => null : () => setOpen(!open)}
        className="flex flex-row justify-between w-full items-center gap-1 md:gap-2 px-[4px] md:px-4 py-2 rounded-xl border border-[#C6EEFE] bg-[#E6F7FE] text-black font-medium cursor-pointer "
        style={{
          boxShadow: `inset 0px -2px 2px #C6EEFE,
          inset 0px 2px 0px #FFFFFF`, // Custom inner shadow
        }}
      >
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
          <span className="text-[3vw] --xs sm:text-[14px] --sm md:text-md">
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
      {isSignedIn && (
        <button
          onClick={() => props.save()}
          className="flex items-center gap-2 px-2 py-2 rounded-xl border border-[#C6EEFE] bg-[#E6F7FE] text-black font-medium  "
          style={{
            boxShadow: `inset 0px -2px 2px #C6EEFE,
          inset 0px 2px 0px #FFFFFF`, // Custom inner shadow
          }}
        >
          {isLoading ? (
            <DotSpinner size={5} />
          ) : props.saved ? (
            <BookmarkFilledIcon className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
          ) : (
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5  object-contain" />
          )}
        </button>
      )}

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
