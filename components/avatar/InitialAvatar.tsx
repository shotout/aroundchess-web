// components/InitialAvatar.tsx
import React, { useMemo } from 'react';

interface InitialAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  textColor?: string;
}

const InitialAvatar: React.FC<InitialAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  textColor = 'text-white',
}) => {
  // Get initials from name
  const initials = useMemo(() => {
    if (!name) return '?';
    
    const nameParts = name.trim().split(/\s+/);
    
    if (nameParts.length === 0) return '?';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  }, [name]);

  // Generate a consistent color based on the name
  const avatarColor = useMemo(() => {
    if (!name) return 'bg-gray-400';
    
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    
    // Use name to generate a consistent index
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }, [name]);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-[14px] --xs',
    md: 'w-12 h-12 text-[14px] --sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${avatarColor} ${textColor} rounded-full flex items-center justify-center font-medium ${className}`}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

export default InitialAvatar;