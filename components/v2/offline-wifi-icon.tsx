/** The crossed-out wifi mark that heads every "you're offline" surface.
 *
 *  Inline SVG rather than the PNG it was traced from
 *  (/images/v2/play-vs-ai/WifinoInternet.png), for one reason: it is the only
 *  image in the app that is *guaranteed* to be needed while there is no
 *  network. Served as a file it cannot win — the service worker's precache is
 *  warmed over the network after load, so a first visit that is already
 *  offline has nothing stored, next/image's /_next/image variant cannot be
 *  answered either, and the offline panel renders with a broken-image box
 *  where its illustration should be. Markup travels with the page that needs
 *  it, so there is nothing left to fetch and nothing left to fail.
 *
 *  Geometry, colours and stroke weights are measured from the PNG, and the
 *  228x228 viewBox is its canvas, so it drops in at the same size with the
 *  same padding.
 */
export function OfflineWifiIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 228 228"
      width={228}
      height={228}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Signal fan: two arcs and the emitter dot. */}
      <g stroke="#221AE9" strokeWidth={15} strokeLinecap="round">
        <path d="M50.5 113.3A107 107 0 0 1 177.5 113.3" />
        <path d="M79.5 134.5A59.6 59.6 0 0 1 148.5 134.5" />
      </g>
      <circle cx={114} cy={161} r={10.5} fill="#221AE9" />

      {/* Error badge. The white disc is the knockout that separates the badge
          from the arc running underneath it. */}
      <circle cx={153} cy={146} r={22} fill="#FFFFFF" />
      <circle cx={153} cy={146} r={18} fill="#FD0000" />
      <path
        d="M146.5 139.5L159.5 152.5M159.5 139.5L146.5 152.5"
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}
