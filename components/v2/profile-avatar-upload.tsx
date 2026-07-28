"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { useProfileStore } from "@/app/store/profile";
import ProfilePictureEditor from "@/components/v2/profile-picture-editor";

interface ProfileAvatarUploadProps {
  /** Sizing / border classes for the circular wrapper (e.g. "w-[80px] h-[80px]"). */
  className?: string;
  /** Rendered when the user has no profile picture yet. */
  fallback: React.ReactNode;
  /** Show the blue pencil badge on the bottom-right corner. */
  showEditBadge?: boolean;
}

/**
 * Circular profile avatar. Clicking opens the "Edit Profile Picture" dialog,
 * where the user picks a file and frames it before it is uploaded — the file
 * used to be sent straight to /profile/picture with no chance to crop it.
 * Used on the profile page and in the sidebar profile card.
 */
const ProfileAvatarUpload = ({
  className = "",
  fallback,
  showEditBadge = false,
}: ProfileAvatarUploadProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const { profile } = useProfileStore();

  const rawPictureUrl = profile?.imageUrl || null;
  // Treat a URL that failed to load as no picture so the fallback renders
  const pictureUrl = rawPictureUrl === failedUrl ? null : rawPictureUrl;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Change profile picture"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditorOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setIsEditorOpen(true);
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
              onError={() => setFailedUrl(pictureUrl)}
            />
          ) : (
            fallback
          )}
        </div>

        {showEditBadge && (
          <span className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[#221AE9] border-2 border-white flex items-center justify-center">
            <Pencil size={12} className="text-white" />
          </span>
        )}
      </div>

      <ProfilePictureEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        currentPictureUrl={pictureUrl}
        fallback={fallback}
      />
    </>
  );
};

export default ProfileAvatarUpload;
