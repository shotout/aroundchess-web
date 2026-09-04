import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
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

function cardImage(spec: ShareCardSpec, origin: string): string {
  return `${origin}${SHARE_IMAGE_PATH}?${shareCardParams(spec)}`;
}

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
  const image = spec ? cardImage(spec, origin) : `${origin}/chess.png`;
  /* Must match what /api/share-image actually renders; a wrong ratio makes
     crawlers crop or skip the preview. The 1200x630 fallback is for the
     no-spec case, which still serves the landscape /chess.png. */
  const size = spec ? shareCardSize(spec) : { w: 1200, h: 630 };

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
      images: [image],
    },
  };
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const spec = parseShareCardSpec(await searchParams);
  const origin = await siteOrigin();
  const meta = spec ? shareCardMeta(spec) : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[28px] bg-white px-[20px] py-[48px]">
      {spec && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={cardImage(spec, origin)}
          alt={meta?.title ?? FALLBACK.title}
          /* Real dimensions, not a hard-coded 1200x630: the cards are portrait
             now, and declaring the old landscape aspect squashed them. */
          width={shareCardSize(spec).w}
          height={shareCardSize(spec).h}
          className="h-auto w-full max-w-[420px] rounded-3xl border border-[#E5E7EB]"
        />
      )}

      <p className="max-w-[620px] text-center text-[18px] text-[#374151]">
        {meta?.text ?? FALLBACK.text}
      </p>

      <Link
        href="/play"
        className="rounded-full bg-[#221AE9] px-[36px] py-[14px] text-[16px] font-semibold text-white"
      >
        Play on AroundChess
      </Link>
    </main>
  );
}
