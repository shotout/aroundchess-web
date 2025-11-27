import Image from "next/image";
import React from "react";

export const GrandmastersSection: React.FC = () => {
  return (
    <section className="py-4 px-0 sm:py-16 lg:py-12 xl:py-16 bg-white">
      <div className="container px-4 md:px-6 lg:px-12 mx-auto">
        <div className="border-2 border-cyan-200 rounded-2xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Content Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header with Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-cyan-400 flex items-center gap-x-2 text-white px-4 py-2 rounded-lg font-bold text-sm lg:text-lg">
                  <Image
                    src="/images/homepage/piece.png"
                    width={50}
                    height={50}
                    className="w-3 h-3 lg:w-6 lg:h-6"
                    alt={""}
                  />
                  <h1 className="text-sm lg:text-base">GM</h1>
                </div>
                <h2 className="text-[14px]  lg:text-[32px] font-semibold text-gray-800">
                  Developed with European Grandmasters
                </h2>
              </div>

              {/* Description Paragraphs */}
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-[14px] -- lg:text-[18px] leading-[1.2]">
                  AroundChess was built with the insight and experience of
                  European chess Grandmasters. Their deep understanding of
                  strategy, training methods, and practical play helped shape
                  some of the platform's core features.
                </p>

                <p className="text-[14px] -- lg:text-[18px] leading-[1.2]">
                  From analyzing real game patterns to refining analysis tools,
                  their input has been invaluable and helped us to provide the
                  best results possible.
                </p>

                <p className="text-[14px] -- lg:text-[18px] leading-[1.2]">
                  Thanks to their guidance, AroundChess offers not just data -
                  but real, instructive chess understanding.
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="lg:col-span-1">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/homepage/gm.png"
                  alt="Chess Grandmaster moving pieces on a chessboard"
                  className="w-full h-64 lg:h-80 object-cover"
                  quality={100}
                  width={1000}
                  height={1000}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
