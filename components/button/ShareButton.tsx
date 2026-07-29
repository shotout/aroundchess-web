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

/** Articles live at /chess-blog/<slug>; built at click time so the link always
 *  carries the real origin (protocol + port) instead of a bare hostname. */
function articleUrl(slug?: string): string {
  if (typeof window === "undefined") return "";
  return slug ? `${window.location.origin}/chess-blog/${slug}` : window.location.href;
}

/** Clipboard API needs a secure context; the textarea fallback keeps Copy
 *  working on plain-http hosts and older mobile browsers. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

const isMobileDevice = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const openExternal = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

const ShareButton = (props: any) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
   const { sessionId } = useProfileStore();

  // The ref wraps the whole component, dropdown included. With it on the
  // trigger alone, mousedown on a share icon counted as "outside", so the
  // dropdown unmounted before the click could fire and no action ever ran.
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
  const shareTitle = props.title ?? "";

  const copyLink = async (message: string) => {
    const ok = await copyToClipboard(articleUrl(props.slug));
    if (ok) toast.success(message);
    else toast.error("Failed to copy link");
    return ok;
  };

  // Plain array, not state: state froze these handlers around the first
  // render's URL, so they kept sharing a stale (and wrong) link.
  const icon = [
    {
      name: "link",
      onPress: () => {
        copyLink("Link copied!");
      },
    },
    {
      name: "mail",
      onPress: () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(
          `Check out this article: ${articleUrl(props.slug)}`
        );
        // location.href, not window.open: a mailto in a new tab leaves an empty
        // tab behind once the mail app takes over.
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
    {
      name: "discord",
      onPress: async () => {
        // Discord has no share intent, so copy the link and open the DM list —
        // on mobile that URL hands off to the app.
        await copyLink("Link copied! Paste it in Discord.");
        openExternal("https://discord.com/channels/@me");
      },
    },
    {
      name: "facebook-circle",
      onPress: async () => {
        const url = articleUrl(props.slug);
        if (isMobileDevice()) {
          // Messenger's app share sheet, with the link already attached.
          window.location.href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
          return;
        }
        // Messenger on the web has no prefill parameter, so copy first.
        await copyLink("Link copied! Paste it in Messenger.");
        openExternal("https://www.messenger.com/");
      },
    },
    {
      name: "whatsapp",
      onPress: () => {
        const text = encodeURIComponent(
          `${shareTitle} ${articleUrl(props.slug)}`.trim()
        );
        // wa.me opens the app on mobile and WhatsApp Web on desktop, message
        // already filled in.
        openExternal(`https://wa.me/?text=${text}`);
      },
    },
    {
      name: "threads",
      onPress: () => {
        const url = encodeURIComponent(articleUrl(props.slug));
        const text = encodeURIComponent(shareTitle);
        // X's post composer, prefilled with the article.
        openExternal(`https://x.com/intent/post?url=${url}&text=${text}`);
      },
    },
  ];
  const renderIconRow = () => {
    return (
      <div className="ml-[3.5vw] flex flex-row items-end gap-3 md:gap-4">
        {icon.map((item: any, index: number) => {
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                item.onPress();
              }}
              key={index}
            >
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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                item.onPress();
                setOpen(false);
              }}
              key={index}
            >
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
    <div
      ref={wrapperRef}
      className="flex flex-row relative items-center justify-center gap-2"
    >
      {/* Button with inner shadow */}
      <div
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
