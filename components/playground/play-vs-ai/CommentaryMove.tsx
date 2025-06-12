import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentaryMoveProps {
  classify: string;
}

export const CommentaryMove = ({ classify }: CommentaryMoveProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    setKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [classify]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Image
        key={key}
        src={`/images/play-vs-ai/${classify}.gif`}
        alt="Move Commentary GIF"
        width={244}
        height={44}
        unoptimized={true}
        priority={true}
        style={{
          animationIterationCount: 1,
        }}
      />
    </div>
  );
};
