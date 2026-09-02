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
  shareMessage,
  type ShareCardSpec,
} from "@/components/v2/share-link";

interface Network {
  id: string;
  label: string;
  icon: string;
  /**
   * Instagram is routed to Stories by `shareImageTo()`, which takes the PNG as
   * a full-bleed background and has no text parameter at all.
   */
  story?: boolean;
  /**
   * Targets the app deliberately shares without a caption: Instagram (Stories
   * has nowhere to put one) and Facebook (`shareToFacebookApp()` attaches
   * none — Meta's policy forbids pre-filled text and the SDK drops it).
   */
  noCaption?: boolean;
  web: (caption: string, url: string) => string;
}

// `filename: 'aroundchess'` in the app's share payload, and one `AroundChess`
// gallery album for every saved card — so one name here too, rather than a
// different one per card kind.
const SHARE_FILE_NAME = "aroundchess.png";

// The mobile app sends the bare message with no link — it has no shareable web
// URL to attach. The web build appends the /s link because that is the only way
// a recipient can open the card; set this to false for captions byte-identical
// to the app's.
const INCLUDE_SHARE_LINK = true;

const NETWORKS: Network[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "/images/v2/play-vs-ai/icon_instagram.png",
    story: true,
    noCaption: true,
    web: () => "https://www.instagram.com/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "/images/v2/play-vs-ai/Icon-whatsapp.png",
    web: (caption) => `https://wa.me/?text=${encodeURIComponent(caption)}`,
  },
  {
    id: "x",
    label: "X",
    icon: "/images/v2/play-vs-ai/Icon-x.png",
    // No `url` param: the caption already carries the link, and passing both
    // makes X render it twice.
    web: (caption) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,
  },
  {
    id: "discord",
    label: "Discord",
    icon: "/images/v2/play-vs-ai/Icon-discord.png",
    web: () => "https://discord.com/channels/@me",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "/images/v2/play-vs-ai/Icon-facebook.png",
    noCaption: true,
    // No `quote`: the app attaches no caption here, and Facebook drops the
    // parameter for unapproved apps anyway. `u` is the sharer's required
    // subject, not a caption, so it stays.
    web: (_caption, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
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

/**
 * Navigate to a share target, reusing a tab opened earlier in the same tap
 * when there is one. Returns false when the browser refused to open anything
 * (popup blocker) so the caller can report it, mirroring the app's
 * `notify('Could not open X.')` instead of failing silently.
 */
function openTarget(tab: Window | null, target: string): boolean {
  if (tab && !tab.closed) {
    tab.location.href = target;
    return true;
  }
  try {
    return !!window.open(target, "_blank", "noopener,noreferrer");
  } catch {
    return false;
  }
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
    download(blob, SHARE_FILE_NAME);
    savedRef.current = true;
    return true;
  };

  const shareTo = async (network: Network) => {
    if (!blob) return;
    const { title } = meta.current;
    const url = shareCardUrl(specRef.current, window.location.origin);
    const story = !!network.story;
    // One caption for every target, matching the app's single `message` arg.
    const message = shareMessage(specRef.current);
    const caption = INCLUDE_SHARE_LINK ? `${message} ${url}` : message;
    const target = network.web(caption, url);

    const file = shareableFile(blob, SHARE_FILE_NAME);
    if (file) {
      // Closest thing the web has to `shareSingle({url, type, message})`: the
      // image always rides along, and the two targets the app shares
      // caption-free stay caption-free here.
      try {
        await (navigator as any).share(
          network.noCaption
            ? { files: [file] }
            : { files: [file], title, text: caption }
        );
        if (story) toast("In Instagram, tap Story — your card is the background.");
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
      //
      // The app's fallback is a FEED share, which does carry `message` — so
      // unlike the Stories path above, this one keeps the caption, on the
      // clipboard where the feed composer can take it.
      const copiedCaption = await copyText(caption);
      const hint = copiedCaption ? " Caption copied." : "";

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
        if (!openTarget(null, target)) {
          toast(`Could not open ${network.label}.`);
          return;
        }
        toast(`${state} — upload it via Create › Post.${hint}`);
      }
      return;
    }

    // Every remaining target takes the same shape of payload the app sends it:
    // the image, plus the caption for everything except Facebook. Previously X
    // and Facebook opened a text-only intent and the card never left this page
    // — the row says "Share image via", so the image now always goes too.
    // Opened before the await so the tap's user activation is still live.
    let tab: Window | null = null;
    try {
      tab = window.open("", "_blank");
      if (tab) tab.opener = null;
    } catch {
      tab = null;
    }

    // Both flavours in one clipboard write, so a paste lands the card in
    // Discord and the caption in a text box. Falls back to a download, which
    // is the only way left to attach the image by hand.
    const copied = await copyImage(
      blob,
      network.noCaption ? undefined : caption
    );
    if (!copied) saveOnce();

    if (!openTarget(tab, target)) {
      toast(`Could not open ${network.label}.`);
      return;
    }

    toast(
      copied
        ? network.noCaption
          ? `Image copied — press Ctrl+V in ${network.label} to send it.`
          : `Image and caption copied — press Ctrl+V in ${network.label} to send it.`
        : `Image saved — attach it to your ${network.label} post.`
    );
  };

  const handleSave = () => {
    if (!blob) return;
    // An explicit tap always writes a copy, even if a share already saved one.
    download(blob, SHARE_FILE_NAME);
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
