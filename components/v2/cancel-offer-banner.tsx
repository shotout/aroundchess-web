import DotSpinner from "@/components/game-history/Spinner";
import { formatDateSubscription } from "@/functions/format-date";
import Image from "next/image";

interface CancelOfferBannerProps {
  /** What the pass costs. */
  price: number;
  /** The same months at the full monthly price, struck through. */
  fullPrice: number;
  months: number;
  analyses: number;
  /** When the offer stops being sold. */
  validUntil: string;
  onGetOffer: () => void;
  isLoading: boolean;
}

/**
 * "Resubscribe now" strip under the plan cards while the cancellation offer
 * runs. Phones: art left, price and button stacked right, end date along the
 * bottom. lg: art | price | button, the price centred on the strip.
 */
export function CancelOfferBanner({
  price,
  fullPrice,
  months,
  analyses,
  validUntil,
  onGetOffer,
  isLoading,
}: CancelOfferBannerProps) {
  return (
    <section
      aria-label="Resubscribe offer"
      className="relative overflow-hidden rounded-[16px] border-b-[4px] border-[#0D5E7C] bg-[#2323EA] text-white lg:rounded-[20px] lg:border-b-[6px]"
    >
      {/* The offer modal's art; cover keeps its diamond pattern unstretched on
          a strip this wide. bg-[#2323EA] is its edge tone. */}
      <Image
        src="/images/v2/cancelation/background.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
        draggable={false}
      />

      <div className="relative px-[10px] pb-[8px] pt-[10px] md:px-[20px] lg:px-[24px] lg:py-[12px] xl:px-[32px] 2xl:px-[40px]">
        <div className="flex items-center gap-[8px] lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-[20px]">
          {/* Its own file name, not header.png: next.config caches optimized
              images for 30 days by URL, so art swapped in under an old name
              keeps showing the old picture. */}
          <Image
            src="/images/v2/cancelation/resubscribe-66.png"
            alt="Enjoy up to 66% off. Resubscribe now"
            width={450}
            height={274}
            draggable={false}
            className="h-auto w-[47%] max-w-[260px] shrink-0 select-none lg:w-full lg:max-w-[190px] lg:justify-self-start xl:max-w-[210px] 2xl:max-w-[240px]"
          />

          {/* lg: `contents` hands the price and the button to the grid as
              columns two and three. */}
          <div className="flex flex-1 flex-col items-center text-center lg:contents">
            <div className="flex flex-col items-center">
              <p className="flex flex-col items-center lg:flex-row lg:items-baseline lg:gap-x-[10px]">
                <span className="relative text-[11px] text-white/60 md:text-[15px] lg:text-[18px] xl:text-[22px] 2xl:text-[24px]">
                  ${fullPrice.toFixed(2)}
                  {/* Same rotated red bar the plan cards use for a struck price. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-[-2px] right-[-2px] top-1/2 h-[2px] -translate-y-1/2 -rotate-12 rounded-full bg-red-500"
                  />
                </span>
                <span className="whitespace-nowrap text-[22px] font-bold leading-none md:text-[32px] lg:text-[38px] xl:text-[44px] 2xl:text-[48px]">
                  ${price.toFixed(2)}
                  <span className="ml-[4px] text-[13px] font-normal md:text-[18px] lg:text-[20px] xl:text-[24px] 2xl:text-[26px]">
                    /{months} {months === 1 ? "month" : "months"}
                  </span>
                </span>
              </p>
              <p className="mt-[4px] text-[11px] font-semibold leading-[130%] md:text-[15px] lg:mt-[6px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
                {analyses.toLocaleString("en-US")} Game Analyses{" "}
                <span className="block font-normal lg:inline">
                  (<span className="font-bold">${(price / analyses).toFixed(2)}</span>{" "}
                  per Analysis)
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onGetOffer}
              disabled={isLoading}
              className="mt-[8px] flex h-[30px] w-[110px] items-center justify-center rounded-full border-[2px] border-white/40 bg-[linear-gradient(180deg,#FFFFFF_0%,#E6F7FE_100%)] text-[13px] font-semibold text-[#221AE9] shadow-[0_6px_18px_rgba(10,20,120,0.3)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 md:h-[40px] md:w-[160px] md:text-[16px] lg:mt-0 lg:h-[52px] lg:w-[200px] lg:justify-self-end lg:border-[3px] lg:text-[20px] xl:h-[56px] xl:w-[230px] xl:text-[22px] 2xl:h-[62px] 2xl:w-[260px] 2xl:text-[24px]"
            >
              {isLoading ? <DotSpinner size={8} /> : "Get Offer"}
            </button>
          </div>
        </div>

        {/* lg: pinned under the centred price instead of taking a row. */}
        <p className="mt-[6px] text-center text-[11px] md:text-[12px] lg:absolute lg:bottom-[8px] lg:left-0 lg:right-0 lg:mt-0">
          Offer ends {formatDateSubscription(validUntil)}
        </p>
      </div>
    </section>
  );
}
