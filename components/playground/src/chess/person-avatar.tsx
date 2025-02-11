'use client';

import { cn } from "@/lib/utils";

interface PersonAvatarProps {
  className?: string;
  seed: number;
  gender: 'male' | 'female';
}

export function PersonAvatar({ className, seed, gender }: PersonAvatarProps) {
  const avatarPath = `/avatars/${gender === 'male' ? 'men' : 'women'}/${seed}.png`;

  return (
    <div className={cn("w-full h-full relative rounded-full overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarPath}
        alt={`${gender} avatar`}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 