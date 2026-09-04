import type { Metadata } from "next";
import { headers } from "next/headers";
import { RedirectHome } from "./redirect-home";
import {
  parseShareCardSpec,
  shareCardMeta,
  shareCardSize,
  shareCardParams,
  shareCardUrl,
  SHARE_IMAGE_PATH,
  type ShareCardSpec,
} from "@/components/v2/share-link";

type SearchParams = Record<string, string | string[] | undefined>;

const FALLBACK = {
  title: "AroundChess",
  text: "Challenge more than 70 AI opponents on AroundChess.",
};

async function siteOrigin(): Promise<string> {
  const list = await headers();
  const host = list.get("x-forwarded-host") ?? list.get("host") ?? "";
  const proto =
    list.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function cardImage(spec: ShareCardSpec, origin: string, wide = false): string {
  const params = shareCardParams(spec);
  if (wide) params.set("w", "1");
  return `${origin}${SHARE_IMAGE_PATH}?${params}`;
}

/**
 * Which crawlers render a tall image well.
 *
 * The card is portrait, which is what WhatsApp and Discord want — they show it
 * at full width. X centre-crops summary_large_image to 2:1 and Facebook prefers
 * ~1.91:1, so both would slice off the logo, half the avatar and the ribbon.
 * Everyone else gets the letterboxed wide variant, which is never cropped, so an
 * unrecognised crawler degrades safely rather than badly.
 */
const TALL_OK = /WhatsApp|Discordbot/i;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const spec = parseShareCardSpec(await searchParams);
  const origin = await siteOrigin();
  const meta = spec ? shareCardMeta(spec) : null;
  const title = meta?.title ?? FALLBACK.title;
  const description = meta?.text ?? FALLBACK.text;

  const agent = (await headers()).get("user-agent") ?? "";
  const tall = TALL_OK.test(agent);
  const image = spec
    ? cardImage(spec, origin, !tall)
    : `${origin}/chess.png`;
  // X reads twitter:image in preference to og:image, so it always gets the
  // wide one regardless of how the og tag came out.
  const twitterImage = spec ? cardImage(spec, origin, true) : image;
  /* Must match what /api/share-image actually renders; a wrong ratio makes
     crawlers crop or skip the preview. The 1200x630 fallback is for the
     no-spec case, which still serves the landscape /chess.png. */
  const size = spec && tall ? shareCardSize(spec) : { w: 1200, h: 630 };

  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "AroundChess",
      title,
      description,
      url: spec ? shareCardUrl(spec, origin) : origin,
      images: [{ url: image, width: size.w, height: size.h, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twitterImage],
    },
  };
}

export default async function SharePage() {
  /* Nothing is rendered for people. The card and the caption live in the
     metadata above, which is what the messaging apps unfurl; a visitor who
     taps the link wants the site, not a picture of the card they were just
     shown. See RedirectHome for why this is not a server redirect(). */
  return <RedirectHome />;
}
