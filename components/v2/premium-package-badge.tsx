import Image from "next/image";

/** The premium plan cards' "You are on this Package" badge; the artwork
 *  carries the wording. */
export const PremiumPackageBadge = () => (
  <Image
    src="/images/v2/subscription/you-are.png"
    alt="You are on this Package."
    width={569}
    height={100}
    className="w-full h-auto"
  />
);
