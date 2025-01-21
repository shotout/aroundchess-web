'use client';

interface ChessAvatarProps {
  type: 'beginner' | 'casual' | 'tactical' | 'master' | 'grandmaster' | 'legend';
  className?: string;
}

const avatarColors = {
  beginner: { bg: '#E3F2FD', accent: '#2196F3' },
  casual: { bg: '#F3E5F5', accent: '#9C27B0' },
  tactical: { bg: '#FFF3E0', accent: '#FF9800' },
  master: { bg: '#E8F5E9', accent: '#4CAF50' },
  grandmaster: { bg: '#FBE9E7', accent: '#FF5722' },
  legend: { bg: '#E1F5FE', accent: '#03A9F4' }
};

export function ChessAvatar({ type, className = '' }: ChessAvatarProps) {
  const colors = avatarColors[type];
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle cx="50" cy="50" r="50" fill={colors.bg} />
        <path
          d={
            type === 'beginner' ? 'M30 70h40v-5L55 50h-10L30 65z M50 20v20m-10 0h20' :
            type === 'casual' ? 'M35 70h30v-5l-15-35-15 35z M35 40h30' :
            type === 'tactical' ? 'M30 70h40v-10l-20-30-20 30z M30 45h40' :
            type === 'master' ? 'M30 70h40v-5l-20-40-20 40z M35 45h30m-25-10h20' :
            type === 'grandmaster' ? 'M25 70h50v-5l-25-45-25 45z M30 40h40m-35-15h30' :
            'M20 70h60v-5l-30-50-30 50z M25 35h50m-45-20h40'
          }
          stroke={colors.accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
} 