import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentaryMoveProps {
  classify: string;
}

export const CommentaryMove = ({ classify }: CommentaryMoveProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [key, setKey] = useState(0);
  /** The commentary animations are 5–10MB each, so the service worker cannot
   *  precache them (see scripts/generate-sw-manifest.mjs) and one that has
   *  never been fetched is simply not available offline. Showing nothing is
   *  the honest answer: the banner is a flourish that disappears after five
   *  seconds anyway, and the alternative is the broken-image box that offline
   *  players were reporting sitting beside the board. */
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setFailed(false);
    setKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [classify]);

  if (!isVisible || failed) {
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
        onError={() => setFailed(true)}
        style={{
          animationIterationCount: 1,
        }}
      />
    </div>
  );
};
