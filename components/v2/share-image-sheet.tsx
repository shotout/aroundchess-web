"use client";

import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  renderShareCard,
  shareCardMeta,
  type ShareCardSpec,
} from "@/components/v2/share-image-canvas";

interface Network {
  id: string;
  label: string;
  icon: string;
  web: (text: string, url: string) => string;
}

const NETWORKS: Network[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "/images/v2/play-vs-ai/icon_instagram.png",
    web: () => "https://www.instagram.com/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "/images/v2/play-vs-ai/Icon-whatsapp.png",
    web: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    id: "x",
    label: "X",
    icon: "/images/v2/play-vs-ai/Icon-x.png",
    web: (text, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
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
    web: (_text, url) =>
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shareTo = async (network: Network) => {
    if (!blob) return;
    const { fileName, text } = meta.current;
    const url = typeof window !== "undefined" ? window.location.origin : "";

    const copied = await copyImage(blob);
    if (!copied) download(blob, fileName);

    window.open(network.web(text, url), "_blank", "noopener,noreferrer");
    toast(
      copied
        ? `Image copied — paste it into your ${network.label} post.`
        : `Image saved — attach it to your ${network.label} post.`
    );
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
