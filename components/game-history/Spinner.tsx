import React from "react";
import { useEffect } from "react";

const DotSpinner: React.FC<{ size?: number }> = ({ size = 12 }) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        50% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={`relative flex items-center justify-center h-${size} w-${size}`}
      >
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 flex items-center justify-start h-full w-full"
            style={{
              transform: `rotate(${index * 45}deg)`,
            }}
          >
            <div
              className="rounded-full bg-blue-base shadow-lg opacity-50 origin-center"
              style={{
                width: size / 2.3,
                height: size / 2.3,
                animation: `pulse 0.999s ease-in-out infinite`,
                animationDelay: `${-0.875 * index * 0.9}s`,
                boxShadow: "0 0 20px rgba(18, 31, 53, 0.3)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DotSpinner;
