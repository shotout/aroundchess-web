"use client";

import { useRef, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";

interface ProfileAvatarUploadProps {
  /** Sizing / border classes for the circular wrapper (e.g. "w-[80px] h-[80px]"). */
  className?: string;
  /** Rendered when the user has no profile picture yet. */
  fallback: React.ReactNode;
  /** Show the blue pencil badge on the bottom-right corner. */
  showEditBadge?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Circular profile avatar that opens a file picker on click and uploads the
 * chosen image to /profile/picture. Used on the profile page and in the
 * sidebar profile card.
 */
const ProfileAvatarUpload = ({
  className = "",
  fallback,
  showEditBadge = false,
}: ProfileAvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadProfilePicture } = useApiClient();
  const { profile, setAlreadyFetch, setAlreadyFetchProfile } =
    useProfileStore();
  const { setCallFetch } = useProfileFetch();

  const pictureUrl = preview || profile?.imageUrl || null;

  const openFileDialog = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still triggers onChange
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await uploadProfilePicture(formData);
      setPreview(objectUrl);
      toast.success("Profile picture updated");
      // Refetch the profile so every consumer picks up the new picture
      setAlreadyFetch(false);
      setAlreadyFetchProfile(false);
      setCallFetch(formatTimePgn());
    } catch (error: any) {
      URL.revokeObjectURL(objectUrl);
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Change profile picture"
      onClick={(e) => {
        e.stopPropagation();
        openFileDialog();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          openFileDialog();
        }
      }}
      className={`relative cursor-pointer shrink-0 ${className}`}
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
        {pictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pictureUrl}
            alt="Profile picture"
            className="w-full h-full object-cover"
          />
        ) : (
          fallback
        )}
      </div>

      {isUploading && (
        <span className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[#221AE9]" />
        </span>
      )}

      {showEditBadge && (
        <span className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[#221AE9] border-2 border-white flex items-center justify-center">
          <Pencil size={12} className="text-white" />
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ProfileAvatarUpload;
