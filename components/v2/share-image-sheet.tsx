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

type ShareMode = "compose" | "paste" | "attach" | "story";

interface Network {
  id: string;
  label: string;
  icon: string;
  mode: ShareMode;
  web: (text: string, url: string) => string;
}

const NETWORKS: Network[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "/images/v2/play-vs-ai/icon_instagram.png",
    mode: "story",
    web: () => "https://www.instagram.com/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "/images/v2/play-vs-ai/Icon-whatsapp.png",
    mode: "attach",
    web: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
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

async function copyImage(blob: Blob, caption?: string): Promise<boolean> {
  const ClipboardItemCtor = (window as any).ClipboardItem;
  if (!navigator.clipboard?.write || !ClipboardItemCtor) return false;

  const write = (items: Record<string, Blob>) =>
    navigator.clipboard.write([new ClipboardItemCtor(items)]);

  try {
    if (caption) {
      try {
        await write({
          "image/png": blob,
          "text/plain": new Blob([caption], { type: "text/plain" }),
        });
        return true;
      } catch {
      }
    }
    await write({ "image/png": blob });
    return true;
  } catch {
    return false;
  }
}

function isMobile(): boolean {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  return /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

function isIOS(): boolean {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  // iPadOS 13+ reports a desktop user agent.
  return /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

const INSTAGRAM_STORY_APP = "instagram://story-camera";

function openApp(scheme: string, fallback: string) {
  const timer = window.setTimeout(() => {
    if (document.visibilityState === "visible") window.location.href = fallback;
  }, 1500);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") window.clearTimeout(timer);
    },
    { once: true }
  );
  window.location.href = scheme;
}

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

  // The browser may prompt for a location on every download, so the card is
  // written to disk at most once per sheet no matter how many networks are used.
  const savedRef = useRef(false);
  const saveOnce = (): boolean => {
    if (!blob || savedRef.current) return false;
    download(blob, meta.current.fileName);
    savedRef.current = true;
    return true;
  };

  const shareTo = async (network: Network) => {
    if (!blob) return;
    const { fileName, text, title } = meta.current;
    const url = shareCardUrl(specRef.current, window.location.origin);
    const story = network.mode === "story";
    const caption =
      network.mode === "compose" || network.mode === "paste"
        ? `${text} ${url}`
        : text;
    const target = network.web(text, url);

    const file = shareableFile(blob, fileName);
    if (file) {
      // Instagram drops the `text` payload when a file rides along, so the
      // caption goes to the clipboard instead. Deliberately not awaited: an
      // await here spends the tap's user activation and iOS Safari then
      // rejects navigator.share.
      const copying = story ? copyText(caption) : null;
      try {
        await (navigator as any).share(
          story ? { files: [file] } : { files: [file], title, text: caption }
        );
        if (story) {
          toast(
            (await copying)
              ? "In Instagram, tap Story — then press and hold the canvas to paste your caption."
              : "In Instagram, tap Story, then add your caption."
          );
        }
        return;
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
      }
    }

    if (story) {
      // No share sheet, so the card has to reach Instagram through the camera
      // roll: the Stories editor only accepts a file handed over by Meta's
      // native sharing API (pasteboard stickers on iOS, a content:// intent on
      // Android), and neither is reachable from a web page.
      const copied = await copyText(caption);
      const hint = copied ? " Caption copied." : "";

      if (isIOS()) {
        // A blob download lands in Files, not Photos, so the story camera's
        // picker would never see it — pressing the preview is the only route
        // into the camera roll from here.
        toast(
          `Press and hold the image above → Save to Photos, then open Instagram › Story.${hint}`
        );
        return;
      }

      const fresh = saveOnce();
      const state = fresh ? "Image saved" : "Image already in your downloads";
      if (isMobile()) {
        // Android indexes downloads into MediaStore, so the card turns up in
        // the story camera's gallery picker.
        openApp(INSTAGRAM_STORY_APP, target);
        toast(`${state} — pick it in the story camera.${hint}`);
      } else {
        // The composer has no linkable route — /create/* is read as a username
        // on a cold load — so the home feed is the closest safe landing spot.
        window.open(target, "_blank", "noopener,noreferrer");
        toast(`${state} — upload it via Create › Post.${hint}`);
      }
      return;
    }

    if (network.mode === "compose") {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

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
      const copied = await copyImage(blob, caption);
      if (!copied) saveOnce();
      message = copied
        ? `Image copied — press Ctrl+V in ${network.label} to send it.`
        : `Image saved — attach it to your ${network.label} post.`;
    }

    if (tab && !tab.closed) tab.location.href = target;
    else window.open(target, "_blank", "noopener,noreferrer");
    toast(message);
  };

  const handleSave = () => {
    if (!blob) return;
    // An explicit tap always writes a copy, even if a share already saved one.
    download(blob, meta.current.fileName);
    savedRef.current = true;
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
