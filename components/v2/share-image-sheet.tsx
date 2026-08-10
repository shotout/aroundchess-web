"use client";

import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { renderShareCard } from "@/components/v2/share-image-canvas";
import {
  shareCardImageUrl,
  shareCardMeta,
  shareCardUrl,
  type ShareCardSpec,
} from "@/components/v2/share-link";

/**
 * How a network can be handed a post that already carries both the card and the
 * caption:
 *
 * - `compose` opens the network's own composer with the caption and the card's
 *   link filled in; the link unfurls into the image, so the user only presses
 *   send.
 * - `paste` has no composer to prefill, so the caption and link go to the
 *   clipboard together — one paste yields both.
 * - `attach` is for Instagram, which neither unfurls links nor accepts a
 *   prefilled caption: the picture is all that can travel with it.
 */
type ShareMode = "compose" | "paste" | "attach";

interface Network {
  id: string;
  label: string;
  icon: string;
  mode: ShareMode;
  web: (text: string, url: string) => string;
  /** Attaching a file costs the message its caption on this network: it takes
   * the image and throws the words away, so it is only ever given the link. */
  dropsSharedText?: boolean;
}

const NETWORKS: Network[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "/images/v2/play-vs-ai/icon_instagram.png",
    mode: "attach",
    web: () => "https://www.instagram.com/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "/images/v2/play-vs-ai/Icon-whatsapp.png",
    mode: "compose",
    web: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    dropsSharedText: true,
  },
  {
    id: "x",
    label: "X",
    icon: "/images/v2/play-vs-ai/Icon-x.png",
    mode: "compose",
    web: (text, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "discord",
    label: "Discord",
    icon: "/images/v2/play-vs-ai/Icon-discord.png",
    mode: "paste",
    web: () => "https://discord.com/channels/@me",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "/images/v2/play-vs-ai/Icon-facebook.png",
    mode: "compose",
    // `quote` prefills the composer's message box where Facebook still honours
    // it, and is ignored — harmlessly — where it does not.
    web: (text, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
];

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function copyText(value: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

async function copyImage(blob: Blob): Promise<boolean> {
  try {
    const ClipboardItemCtor = (window as any).ClipboardItem;
    if (!navigator.clipboard?.write || !ClipboardItemCtor) return false;
    await navigator.clipboard.write([new ClipboardItemCtor({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

function isMobile(): boolean {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  // iPadOS 13+ reports itself as a Mac; a touch screen is what gives it away,
  // and it is the one platform where the OS share sheet is the good path.
  return /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

/**
 * Hands the PNG to the OS share sheet, which lists the messaging apps the
 * phone actually has installed and attaches the image for the user. Returns
 * false when the platform cannot share files, so the caller falls back to the
 * copy-and-open-a-web-intent flow.
 */
function shareableFile(blob: Blob, fileName: string): File | null {
  if (!isMobile()) return null;
  try {
    const file = new File([blob], fileName, { type: "image/png" });
    const nav = navigator as any;
    return nav.share && nav.canShare?.({ files: [file] }) ? file : null;
  } catch {
    return null;
  }
}

interface ShareImageSheetProps {
  spec: ShareCardSpec;
  onClose: () => void;
}

export function ShareImageSheet({ spec, onClose }: ShareImageSheetProps) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const meta = useRef(shareCardMeta(spec));

  const specRef = useRef(spec);
  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    renderShareCard(specRef.current)
      .then((result) => {
        if (cancelled) return;
        url = URL.createObjectURL(result);
        setBlob(result);
        setPreviewUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  // Facebook renders the preview from a single crawl it makes while the share
  // dialog opens, and it caches a miss. Rendering the card now means that crawl
  // hits a warm CDN copy instead of a cold function.
  useEffect(() => {
    fetch(shareCardImageUrl(specRef.current, window.location.origin), {
      cache: "force-cache",
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shareTo = async (network: Network) => {
    if (!blob) return;
    const { fileName, text, title } = meta.current;
    // No web composer accepts an attached image — they build their preview from
    // the OpenGraph tags of whatever link they are given. Sharing the card's own
    // page is what carries the picture along with the words.
    const url = shareCardUrl(specRef.current, window.location.origin);
    const caption = `${text} ${url}`;
    const target = network.web(text, url);

    // The OS share sheet is the one route that attaches the real photo, so on a
    // phone it wins wherever the app keeps the caption with it.
    const file = network.dropsSharedText ? null : shareableFile(blob, fileName);
    if (file) {
      try {
        await (navigator as any).share({ files: [file], title, text: caption });
        return;
      } catch (err) {
        // The user dismissed the sheet — nothing more to do.
        if ((err as any)?.name === "AbortError") return;
      }
    }

    if (network.mode === "compose") {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

    // Reserve the tab synchronously: mobile browsers drop the user gesture once
    // the handler awaits, so opening after the copy/download gets popup-blocked.
    let tab: Window | null = null;
    try {
      tab = window.open("", "_blank");
      if (tab) tab.opener = null;
    } catch {
      tab = null;
    }

    let message: string;
    if (network.mode === "paste") {
      const copied = await copyText(caption);
      message = copied
        ? `Message copied — paste it into ${network.label} and the card comes with it.`
        : `Copy this and paste it into ${network.label}: ${caption}`;
    } else {
      const copied = await copyImage(blob);
      if (!copied) download(blob, fileName);
      message = copied
        ? `Image copied — paste it into your ${network.label} post.`
        : `Image saved — attach it to your ${network.label} post.`;
    }

    if (tab && !tab.closed) tab.location.href = target;
    else window.open(target, "_blank", "noopener,noreferrer");
    toast(message);
  };

  const handleSave = () => {
    if (!blob) return;
    download(blob, meta.current.fileName);
    toast("Image saved.");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[600] flex items-stretch justify-center bg-black/50 sm:items-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[560px] flex-col overflow-y-auto bg-white p-[20px] sm:max-h-[95vh] sm:rounded-3xl sm:p-[28px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="mb-[16px] w-fit text-[#111827] hover:text-[#374151]"
        >
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>

        <div className="flex min-h-[240px] items-center justify-center rounded-3xl bg-[#C7C7C7] p-[14px] sm:min-h-[320px] sm:p-[18px]">
          {previewUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewUrl}
              alt="Share preview"
              className="max-h-[46vh] w-auto max-w-full object-contain"
            />
          ) : failed ? (
            <p className="px-4 text-center text-[14px] text-[#4B5563]">
              The image could not be created. Please try again.
            </p>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-[#221AE9]" />
          )}
        </div>

        <p className="mt-[24px] text-[14px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">
          Share image via
        </p>

        <div className="mt-[16px] flex flex-wrap items-start justify-between gap-y-[16px]">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              type="button"
              onClick={() => shareTo(network)}
              disabled={!blob}
              className="flex w-[19%] min-w-[64px] flex-col items-center gap-[8px] disabled:opacity-50"
            >
              <Image
                src={network.icon}
                alt=""
                width={96}
                height={96}
                className="h-[58px] w-[58px] object-contain transition-transform active:scale-95"
              />
              <span className="text-[13px] text-[#6B7280]">{network.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!blob}
          className="mt-[28px] flex w-full items-center justify-center gap-[10px] rounded-full border border-[#221AE9] py-[14px] text-[16px] font-semibold text-[#221AE9] transition-colors hover:bg-[#221AE908] disabled:opacity-50"
        >
          <Image
            src="/images/v2/play-vs-ai/download.png"
            alt=""
            width={32}
            height={32}
            className="h-[22px] w-[22px] object-contain"
          />
          Save Image to Gallery
        </button>
      </div>
    </div>
  );
}
