"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2, Minus, Move, Plus, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
/** Side of the square written to the server. */
const OUTPUT_SIZE = 512;
/**
 * Zoom is a multiple of "fit" — the scale at which the whole image sits inside
 * the crop stage, edge to edge, with nothing trimmed. Zoom 1 is therefore the
 * picture exactly as the user supplied it, and where a freshly picked file
 * lands: they see all of what they chose, then scale up or down from there.
 *
 * It used to be a multiple of *cover*, which fills the stage by cropping
 * whatever doesn't fit the aspect ratio. That is why an upload arrived already
 * trimmed and already at the slider's left stop — cover was both the starting
 * point and the floor, so the control could only ever crop in further.
 */
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
/** Pixels moved per arrow-key press. */
const NUDGE = 8;

interface ProfilePictureEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing picture, shown until a new file is chosen. */
  currentPictureUrl?: string | null;
  /** Rendered in the circle when there is no picture at all. */
  fallback?: React.ReactNode;
}

/**
 * "Edit Profile Picture": pick a file, then pan and zoom to choose which part
 * of it becomes the (circular) avatar. Save crops to a square via canvas and
 * posts that to /profile/picture, so the server stores what the user framed
 * rather than the whole original.
 */
const ProfilePictureEditor = ({
  open,
  onOpenChange,
  currentPictureUrl,
  fallback,
}: ProfilePictureEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  /** Scale at which the whole image fits the stage; 0 until measured. */
  const [baseScale, setBaseScale] = useState(0);

  const { uploadProfilePicture } = useApiClient();
  const { setAlreadyFetch, setAlreadyFetchProfile } = useProfileStore();
  const { setCallFetch } = useProfileFetch();

  const resetEdits = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
    setOffset({ x: 0, y: 0 });
    // Belongs to the outgoing image. Clearing it also hides the new one until it
    // has been measured, so it can't flash at natural size first.
    setBaseScale(0);
  }, []);

  // Drop the object URL and any pending edits whenever the dialog closes.
  useEffect(() => {
    if (open) return;
    setFile(null);
    resetEdits();
    setImageSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [open, resetEdits]);

  const acceptFile = (candidate?: File | null) => {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      toast.error("Please choose a JPG or PNG image");
      return;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setImageSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(candidate);
    });
    setFile(candidate);
    resetEdits();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0];
    // Reset so picking the same file again still fires onChange
    event.target.value = "";
    acceptFile(chosen);
  };

  /**
   * The scale that fits the whole image inside the stage — min, not max, of the
   * two ratios. That is what makes zoom 1 the untouched picture: the larger side
   * meets the stage's edge and the shorter one falls short, so nothing is cut.
   */
  const measureStage = useCallback(() => {
    const viewport = viewportRef.current;
    const img = imageRef.current;
    if (!viewport || !img?.naturalWidth) return;

    const box = viewport.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const fit = Math.min(
      box.width / img.naturalWidth,
      box.height / img.naturalHeight
    );
    setBaseScale((prev) => (Math.abs(prev - fit) < 0.0001 ? prev : fit));
  }, []);

  // The stage is responsive, so its box — and with it the cover scale and the
  // floor — changes with the window.
  useEffect(() => {
    if (!imageSrc) return;
    const viewport = viewportRef.current;
    measureStage();
    const ro = new ResizeObserver(measureStage);
    if (viewport) ro.observe(viewport);
    window.addEventListener("resize", measureStage);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureStage);
    };
  }, [imageSrc, measureStage]);

  /** Keep the image covering the crop circle — no empty gaps inside it. */
  const clampOffset = useCallback(
    (next: { x: number; y: number }, atZoom: number) => {
      const viewport = viewportRef.current;
      const img = imageRef.current;
      if (!viewport || !img?.naturalWidth) return next;

      const box = viewport.getBoundingClientRect();
      const fit = Math.min(
        box.width / img.naturalWidth,
        box.height / img.naturalHeight
      );
      const drawnW = img.naturalWidth * fit * atZoom;
      const drawnH = img.naturalHeight * fit * atZoom;
      // Bound by the circle, not the stage. At fit scale the image is smaller
      // than the stage in one axis, and bounding by the stage would pin panning
      // to dead centre even with slack either side of the circle. Where the
      // image is smaller than the circle the bound is 0, which centres it —
      // there is genuinely nothing to choose between.
      const cropSide = Math.min(box.width, box.height);
      const maxX = Math.max(0, (drawnW - cropSide) / 2);
      const maxY = Math.max(0, (drawnH - cropSide) / 2);

      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      };
    },
    []
  );

  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  // Re-clamp the pan whenever the zoom changes, rather than inside the click
  // handlers — those would read a stale `zoom` and collapse rapid presses of
  // the +/- buttons into a single step.
  useEffect(() => {
    setOffset((prev) => clampOffset(prev, zoom));
  }, [zoom, clampOffset]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imageSrc) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    setOffset(
      clampOffset(
        {
          x: drag.baseX + (e.clientX - drag.startX),
          y: drag.baseY + (e.clientY - drag.startY),
        },
        zoom
      )
    );
  };

  const endDrag = () => {
    dragRef.current.active = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!imageSrc) return;
    const moves: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -NUDGE, y: 0 },
      ArrowRight: { x: NUDGE, y: 0 },
      ArrowUp: { x: 0, y: -NUDGE },
      ArrowDown: { x: 0, y: NUDGE },
    };
    const delta = moves[e.key];
    if (!delta) return;
    e.preventDefault();
    setOffset((prev) =>
      clampOffset({ x: prev.x + delta.x, y: prev.y + delta.y }, zoom)
    );
  };

  /** Redraw the framed region at OUTPUT_SIZE and hand back a JPEG blob. */
  const cropToBlob = async (): Promise<Blob | null> => {
    const viewport = viewportRef.current;
    const img = imageRef.current;
    if (!viewport || !img?.naturalWidth) return null;

    const box = viewport.getBoundingClientRect();
    // The crop circle is the largest one that fits the viewport.
    const cropSide = Math.min(box.width, box.height);
    // Same basis the stage draws with — fit, not cover — or the saved crop would
    // not be the region the user framed.
    const fit = Math.min(
      box.width / img.naturalWidth,
      box.height / img.naturalHeight
    );
    const scale = fit * zoom;

    // Top-left of the crop square in source-image pixels.
    const sourceSide = cropSide / scale;
    const centerX = img.naturalWidth / 2 - offset.x / scale;
    const centerY = img.naturalHeight / 2 - offset.y / scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    // The circle can now be wider than the picture — a portrait photo at fit
    // scale doesn't reach its sides. Those pixels are never written, and a JPEG
    // renders untouched canvas as black, so paint them white first.
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      centerX - sourceSide / 2,
      centerY - sourceSide / 2,
      sourceSide,
      sourceSide,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92)
    );
  };

  const handleSave = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);
    try {
      const blob = await cropToBlob();
      if (!blob) throw new Error("Could not process the image");

      const formData = new FormData();
      formData.append(
        "image",
        new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" })
      );
      await uploadProfilePicture(formData);

      toast.success("Profile picture updated");
      // Refetch so every consumer picks up the new picture
      setAlreadyFetch(false);
      setAlreadyFetchProfile(false);
      setCallFetch(formatTimePgn());
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const hasNewImage = Boolean(imageSrc);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92%] max-w-[520px] max-h-[95%] rounded-[24px] sm:rounded-[16px] bg-white p-0 md:p-0 gap-0 overflow-y-auto">
        <div className="px-[20px] pt-[20px] pb-[8px] sm:px-[24px]">
          <DialogTitle className="text-[26px] sm:text-[24px] font-bold text-[#111827] pr-8">
            Edit Profile Picture
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a picture, then drag and zoom to pick the part of it to use.
          </DialogDescription>
        </div>

        <div className="px-[20px] pb-[20px] sm:px-[24px] sm:pb-[24px] flex flex-col gap-[16px]">
          {hasNewImage ? (
            <>
              {/* Crop stage: the image pans/zooms under a fixed circular mask. */}
              <div
                ref={viewportRef}
                role="application"
                tabIndex={0}
                aria-label="Reposition the image"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown}
                className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-[12px] bg-[#0B1220] cursor-grab active:cursor-grabbing touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-[#221AE9]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* Natural size, scaled by baseScale * zoom — NOT w-full h-full
                    object-cover. object-cover crops the image to the stage's
                    aspect before any transform runs, so zooming below 1 shrank
                    an already-cropped picture and the trimmed edges could never
                    come back. At natural size the transform is the only thing
                    sizing it, and zooming out genuinely reveals more. */}
                <img
                  ref={imageRef}
                  src={imageSrc as string}
                  alt=""
                  draggable={false}
                  onLoad={() => {
                    measureStage();
                    setOffset((prev) => clampOffset(prev, zoom));
                  }}
                  className="absolute left-1/2 top-1/2 max-w-none w-auto h-auto"
                  style={{
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${
                      baseScale * zoom
                    })`,
                    // Hidden for the frame between decode and measurement —
                    // otherwise a large photo paints once at full natural size.
                    visibility: baseScale ? "visible" : "hidden",
                  }}
                />
                {/* Circular mask so it's obvious which part becomes the avatar:
                    the huge spread shadow dims everything outside the circle. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square h-full rounded-full ring-2 ring-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-[#4B5563]">
                <Move size={18} className="shrink-0" />
                <span className="text-[15px] sm:hidden">
                  Drag to reposition the image
                </span>
                <span className="text-[15px] hidden sm:inline">
                  Drag or use arrow keys to reposition the image
                </span>
              </div>

              <div className="flex items-center gap-[12px]">
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                  className="shrink-0 w-[36px] h-[36px] rounded-full border border-[#221AE9] text-[#221AE9] flex items-center justify-center disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(clampZoom(Number(e.target.value)))}
                  aria-label="Zoom"
                  className="profile-zoom-range flex-1"
                  // WebKit can't fill the track left of the thumb on its own.
                  style={{
                    background: `linear-gradient(to right, #221AE9 ${
                      ((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100
                    }%, #DDE3E8 ${
                      ((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100
                    }%)`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                  className="shrink-0 w-[36px] h-[36px] rounded-full border border-[#221AE9] text-[#221AE9] flex items-center justify-center disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>
            </>
          ) : (
            /* Nothing picked yet — show the current avatar. */
            <div className="flex justify-center py-[8px]">
              <div className="w-[180px] h-[180px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden bg-[#E5E7EB] flex items-center justify-center">
                {currentPictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPictureUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  fallback
                )}
              </div>
            </div>
          )}

          {/* Drop zone / file picker */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              acceptFile(e.dataTransfer.files?.[0]);
            }}
            className={`rounded-[12px] border border-dashed px-[16px] py-[14px] text-center transition-colors ${
              isDragOver
                ? "border-[#221AE9] bg-[#221AE9]/5"
                : "border-[#C0CED4] bg-[#F5F7F9]"
            }`}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center gap-[6px] sm:flex-row sm:justify-center sm:gap-[8px]"
            >
              <Upload size={20} className="text-[#221AE9] shrink-0" />
              {/* Mobile is link-only; desktop leads with "Drag and drop or". */}
              <span className="text-[15px] font-semibold text-[#221AE9] underline underline-offset-2 sm:hidden">
                Upload a different Profile Picture
              </span>
              <span className="hidden sm:inline text-[15px] text-[#374151]">
                Drag and drop or{" "}
                <span className="text-[#221AE9] font-semibold underline underline-offset-2">
                  upload a different Profile Picture
                </span>
              </span>
            </button>
            <p className="mt-[4px] text-[13px] text-[#6B7280]">
              (JPG or PNG) maximum file size 5 MB.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
              className="h-[48px] rounded-full border border-[#221AE9] text-[#221AE9] text-[16px] font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasNewImage || isUploading}
              className={`h-[48px] rounded-full text-[16px] font-semibold flex items-center justify-center gap-2 ${
                hasNewImage && !isUploading
                  ? "bg-[#221AE9] text-white hover:opacity-90"
                  : "bg-[#DDE3E8] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureEditor;
