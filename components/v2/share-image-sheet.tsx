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

interface Network {
  id: string;
  label: string;
  icon: string;
  /**
   * Targets that get the caption WITHOUT the /s link appended. Applies to both
   * paths: the text handed to navigator.share on mobile, and the prefilled
   * `?text=` on desktop.
   *
   * Nothing sets this today, and WhatsApp is the reason it exists — worth
   * recording so it isn't switched back on by mistake.
   *
   * WhatsApp's prefilled share carries EITHER the caption OR a link in the
   * MESSAGE TEXT, never both: append a URL and the composer arrives holding
   * only that URL. Traced with curl — the text is intact through wa.me's 302,
   * through api.whatsapp.com, and into the `web.whatsapp.com/send/?text=` it
   * builds, so it is WhatsApp Web's own composer that drops it. Ruled out:
   * link length, space vs `\n\n` separator, ASCII vs typographic apostrophe,
   * wa.me vs api.whatsapp.com.
   *
   * The caption is NOT lost, though — it comes back inside the unfurl, because
   * /s sets og:description to the same sentence. So the link wins: the
   * recipient gets a preview card carrying the card image, the title AND the
   * caption, with no paste required. Dropping the link would trade all of that
   * for one line of plain text.
   */
  noLink?: boolean;
  /**
   * Targets that throw the caption away, so it has to reach the post through
   * the clipboard instead. Facebook is the only one: Meta's platform policy
   * forbids prefilling the user's message and they enforce it at their end, so
   * `sharer.php?quote=` is ignored on mobile, `fb://` accepts no payload at
   * all, and the Facebook app's share extension drops the `text` handed to
   * navigator.share(). WhatsApp and X differ only in that they choose to
   * honour `?text=`.
   */
  captionBlocked?: boolean;
  web: (caption: string, url: string) => string;
}

// `filename: 'aroundchess'` in the app's share payload, and one `AroundChess`
// gallery album for every saved card — so one name here too, rather than a
// different one per card kind.
const SHARE_FILE_NAME = "aroundchess.png";

// The mobile app sends the bare message with no link — it has no shareable web
// URL to attach. The web build appends the /s link because that is the only way
// a recipient can open the card; set this to false for captions byte-identical
// to the app's. Individual targets opt out with `noLink` (see WhatsApp).
const INCLUDE_SHARE_LINK = true;

const NETWORKS: Network[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "/images/v2/play-vs-ai/Icon-whatsapp.png",
    // api.whatsapp.com directly, not wa.me. Observed: wa.me is only a 302 to
    // `api.whatsapp.com/send/?text=…&type=custom_url&app_absent=0`, and it
    // re-encodes the payload on the way through (every %20 becomes a `+`).
    // The caption is still whole at that hop, so wa.me is not what drops it —
    // but the extra redirect and re-encode buy us nothing, so skip them.
    web: (caption) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`,
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
    id: "facebook",
    label: "Facebook",
    icon: "/images/v2/play-vs-ai/Icon-facebook.png",
    // No link in the caption: `u` already carries it, and Facebook is the one
    // target where the URL would appear twice in the same post.
    noLink: true,
    captionBlocked: true,
    // `quote` is Facebook's only prefill parameter and it is honoured
    // inconsistently — Meta discourages prefilled captions, so it may be
    // ignored entirely. Sending it costs nothing when it is ignored and fills
    // the composer when it is not. `u` stays: it is the required subject, and
    // what Facebook unfurls into the card.
    //
    // noCaption removed with it, so the desktop clipboard now carries the
    // caption too — if Facebook drops `quote`, one Ctrl+V still puts the words
    // in the composer.
    web: (caption, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(caption)}`,
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

/**
 * Text-only clipboard write, started but NOT awaited — the caller is inside a
 * tap that is about to call navigator.share(), and awaiting anything first
 * risks spending the transient user activation that share needs (the same
 * hazard the desktop path works around by opening its tab before the await).
 *
 * Returns whether a write was even attempted, so the caller only promises the
 * user a paste when there is a clipboard to paste from; a write that starts
 * and then fails reports itself.
 */
function copyTextInBackground(text: string): boolean {
  if (!navigator.clipboard?.writeText) return false;
  navigator.clipboard.writeText(text).catch(() => {
    toast("Could not copy the caption.");
  });
  return true;
}

function isMobile(): boolean {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  return /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
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

/**
 * Mobile only, deliberately. Routing desktop WhatsApp through the OS share
 * sheet was tried and reverted: on macOS the sheet opens with the PNG but does
 * not list WhatsApp at all (it registers no share extension), so the user got a
 * useless picker, and `await navigator.share()` had already consumed the tap's
 * user activation, so the wa.me fallback's window.open was then blocked —
 * "Could not open WhatsApp." Desktop keeps the clipboard + wa.me flow, which
 * works.
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
    // Both halves come from the same shareCardMeta() call as the card itself:
    // `text` describes what actually happened ("I just won against Lisa … my
    // ELO is now 412 (+12)."), where the old shareMessage() was a fixed
    // "My game on AroundChess" for every result. Deliberately no longer
    // byte-identical to the RN app's single `message` arg.
    const { title, text: message } = meta.current;
    const url = shareCardUrl(specRef.current, window.location.origin);
    // Caption, blank line, link — the order that reads best everywhere it
    // survives (X and the mobile share sheet).
    //
    // It makes no difference to WhatsApp, which is worth recording so nobody
    // re-runs the experiment: WhatsApp Web's composer keeps ONLY the URL out of
    // any text containing one, and drops every other word. Tested caption-first
    // and url-first, space and blank-line separators, 270- and 220-character
    // links, ASCII and typographic apostrophes, wa.me and api.whatsapp.com —
    // same result every time. With no URL at all the caption arrives intact, so
    // the URL is the trigger, not the caption. The caption is not really lost
    // though: /s sets og:description to the same sentence, so it reappears
    // inside the link's preview card along with the image.
    // "\u{1F449} <url>" on its own line: the arrow is part of the copy the
    // captions were written around. Facebook is excluded via `noLink` because
    // it carries the link in its own `u` parameter — appending a bare arrow
    // with nothing after it would be worse than no line at all.
    const withLink = (text: string) =>
      INCLUDE_SHARE_LINK ? `${text}\n\n\u{1F449} ${url}` : text;
    const caption = network.noLink ? message : withLink(message);
    const target = network.web(caption, url);

    const file = shareableFile(blob, SHARE_FILE_NAME);
    if (file) {
      // Facebook will discard the `text` below, so the words go to the
      // clipboard as well and one paste puts them in the composer. The link
      // rides along in this copy even though `noLink` strips it from the
      // caption: noLink exists because sharer.php's `u` already carries the
      // URL, and there is no `u` on this path — without it the post has no way
      // back to the site. Started before share() and deliberately not awaited.
      const pastable = network.captionBlocked
        ? copyTextInBackground(withLink(message))
        : false;
      if (pastable) {
        // Top-center and long: the OS sheet is about to cover the page from
        // the bottom, and the user may only read this once they are back.
        toast(`Caption copied — paste it into your ${network.label} post.`, {
          position: "top-center",
          duration: 10_000,
        });
      }

      // Closest thing the web has to `shareSingle({url, type, message})`. The
      // caption rides along for every target: through the OS share sheet the
      // text is just part of the payload the user is sending, and an app that
      // can't use it ignores it.
      try {
        await (navigator as any).share({ files: [file], title, text: caption });
        return;
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
      }
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

    // Image and caption in one clipboard write, so a single paste can carry
    // both. Falls back to a download, the only way left to attach by hand.
    const copied = await copyImage(blob, caption);
    if (!copied) saveOnce();

    if (!openTarget(tab, target)) {
      toast(`Could not open ${network.label}.`);
      return;
    }

    toast(
      copied
        ? isMobile()
          ? `Image and caption copied — paste them in ${network.label} to send.`
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
        /* The two margins centre the sheet over the CONTENT rather than the
           window — the shell pins a header across the top and, from 1280px up,
           a sidebar of window.innerWidth/6 down the left, so a window-centred
           panel reads high and to the left of the area it belongs to.
           Under justify-center/items-center a leading margin M moves the
           panel's centre to (size + M)/2, so M = exactly the strip being
           displaced by. vw counts the scrollbar just as innerWidth does, and xl
           is the 1280px the shell itself switches the sidebar on at.
           max-h drops by the same header strip so a tall sheet still ends
           inside the viewport instead of running off the bottom.
           The backdrop stays full-bleed, so the dim and the click-to-close
           still cover both the header and the sidebar. */
        className="relative flex w-full max-w-[560px] flex-col overflow-y-auto bg-white p-[20px] sm:mt-[calc(var(--banner-height,0px)_+_var(--current-header-height))] sm:max-h-[calc(95vh_-_var(--banner-height,0px)_-_var(--current-header-height))] sm:rounded-3xl sm:p-[28px] xl:ml-[16.6667vw]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="mb-[16px] w-fit text-[#111827] hover:text-[#374151]"
        >
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>

        {/* shrink-0: the sheet is a fixed-height flex column on mobile, so without
            it this box collapses to its min-height while the image keeps its own
            max-height and spills out over the grey. */}
        <div className="flex min-h-[240px] shrink-0 items-center justify-center rounded-3xl bg-[#C7C7C7] p-[14px] sm:min-h-[320px] sm:p-[18px]">
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

        <div className="mt-[16px] flex flex-wrap items-start justify-center gap-x-[28px] gap-y-[16px] sm:gap-x-[44px]">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              type="button"
              onClick={() => shareTo(network)}
              disabled={!blob}
              className="group flex min-w-[64px] flex-col items-center gap-[10px] disabled:opacity-50"
            >
              <Image
                src={network.icon}
                alt=""
                width={96}
                height={96}
                className="h-[68px] w-[68px] object-contain transition-transform group-active:scale-95"
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
