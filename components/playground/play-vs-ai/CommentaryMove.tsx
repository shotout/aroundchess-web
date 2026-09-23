import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface CommentaryMoveProps {
  classify: string;
}

export const CommentaryMove = ({ classify }: CommentaryMoveProps) => {
  const [isVisible, setIsVisible] = useState(true);
  /** The commentary animations are 5–10MB each, so the service worker cannot
   *  precache them (see scripts/generate-sw-manifest.mjs) and one that has
   *  never been fetched is simply not available offline. Showing nothing is
   *  the honest answer: the banner is a flourish that disappears after five
   *  seconds anyway, and the alternative is the broken-image box that offline
   *  players were reporting sitting beside the board. */
  const [failed, setFailed] = useState(false);

  /** Stable on purpose, and load-bearing. next/image attaches its <img> with a
   *  callback ref that lists `onError` among its dependencies, and that ref
   *  runs `img.src = img.src` whenever an onError handler is present (its
   *  workaround for errors thrown before hydration). A new arrow function per
   *  render gave the ref a new identity every render, so React re-attached it
   *  and the self-assignment re-ran — which restarts an animated GIF from its
   *  first frame. The board re-renders on every drag, so the banner blinked
   *  for as long as a piece was being moved. */
  const handleError = useCallback(() => setFailed(true), []);

  /** No remount key here on purpose. Bumping one after mount tore the <img>
   *  down and built a new one while the GIF was still painting, so the banner
   *  blanked and replayed its fade-in — the blink. The banner is already
   *  unmounted between moves (the board clears the classification first), so
   *  each new move gets a fresh element without any help, and a classification
   *  that changes in place (a move followed by checkmate) swaps `src`, which
   *  starts the new animation on its own. */
  useEffect(() => {
    setIsVisible(true);
    setFailed(false);

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
        src={`/images/play-vs-ai/${classify}.gif`}
        alt="Move Commentary GIF"
        width={244}
        height={44}
        unoptimized={true}
        priority={true}
        onError={handleError}
        style={{
          animationIterationCount: 1,
        }}
      />
    </div>
  );
};
