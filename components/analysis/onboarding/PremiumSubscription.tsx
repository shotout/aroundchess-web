"use client";

import Image from "next/image";
import {
  Book,
  Bot,
  Target,
  Zap,
  Crown,
  DollarSign,
  Award,
  Users,
  Cat,
  Settings,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PremiumSubscriptionProps {
  visible: boolean;
  onClose: () => void;
  onGetPremium: () => void;
}

export const PremiumSubscription = ({
  visible,
  onClose,
  onGetPremium,
}: PremiumSubscriptionProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative max-w-[700px] max-h-[90vh] overflow-y-auto bg-blue-50 border border-blue-100 rounded-xl w-[95%] z-50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/my-game-history/pattern.png"
            alt="Background Pattern"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative z-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center px-6 pt-6 pb-4">
            <h2 className="text-2xl font-bold">Go Premium now</h2>
            <p className="text-base">
              for unlimited access and become a Chess Master
            </p>
          </div>

          {/* Features section */}
          <div className="text-center px-4 pb-4">
            <p className="text-sm text-gray-700 mb-3">
              Discover our Suite of Powerful Features with the AroundChess{" "}
              <span className="text-blue-base font-medium">
                Premium Subscription:
              </span>
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
              {/* Feature icons */}
              <div className="bg-blue-base/5 border p-2 rounded-lg border-blue-base flex flex-col items-center">
                <Cat className="w-8 h-8 mb-1 text-blue-base" />
                <p className="text-xs font-medium text-black">Analyze Games</p>
              </div>

              <div className="bg-blue-base/5 border p-2 rounded-lg border-blue-base flex flex-col items-center">
                <Book className="w-8 h-8 mb-1 text-blue-base" />
                <p className="text-xs font-medium text-black">Chess Theory</p>
              </div>

              <div className="bg-blue-base/5 border p-2 rounded-lg border-blue-base flex flex-col items-center">
                <Bot className="w-8 h-8 mb-1 text-blue-base" />
                <p className="text-xs font-medium text-black">Play VS AI</p>
              </div>

              <div className="bg-blue-base/5 border p-2 rounded-lg border-blue-base flex flex-col items-center">
                <Settings className="w-8 h-8 mb-1 text-blue-base" />
                <p className="text-xs font-medium text-black">Chess Puzzles</p>
              </div>

              <div className="bg-blue-base/5 border p-2 rounded-lg border-blue-base flex flex-col items-center">
                <Target className="w-8 h-8 mb-1 text-blue-base" />
                <p className="text-xs font-medium text-black">Board Vision</p>
              </div>

              <div className="bg-blue-base/5 border p-2 rounded-lg border-blue-base flex flex-col items-center">
                <Zap className="w-8 h-8 mb-1 text-blue-base" />
                <p className="text-xs font-medium text-black">
                  Endgame Training
                </p>
              </div>
            </div>

            {/* Pricing packages */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Free package */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-12 h-12 text-indigo-500 p-2 bg-blue-50 rounded-full" />
                  <div className="text-left">
                    <h3 className="text-base font-bold">Free Package</h3>
                    <div className="text-2xl font-bold">$0</div>
                  </div>
                </div>

                <p className="text-left text-gray-700 text-sm mb-3">
                  Our Basic Package for free limited Access!
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-blue-base w-5 h-5" />
                    <p className="text-left text-sm">
                      1 Game Analysis every 72h
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-blue-base w-5 h-5" />
                    <p className="text-left text-sm">
                      Limited Access to the Feedback Log
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-blue-base w-5 h-5" />
                    <p className="text-left text-sm">20 Puzzles per month</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-blue-base w-5 h-5" />
                    <p className="text-left text-sm">Play vs. AI</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-blue-base w-5 h-5" />
                    <p className="text-left text-sm">Board Vision Training</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-blue-base w-5 h-5" />
                    <p className="text-left text-sm">Chess Handbook</p>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-base" />
                  <p className="text-left text-sm">You are on this Package.</p>
                </div>
              </div>

              {/* Premium package */}
              <div className="bg-gradient-to-br from-[#221AE9] to-[#25CEDA] text-white p-4 rounded-xl shadow-md relative">
                <div className="absolute top-0 left-1/4 -translate-y-1/2 bg-[#A855F7] px-3 py-2 rounded-full text-xs font-medium">
                  For frequent Chess Players
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-12 h-12 text-white p-2 bg-blue-500 rounded-full" />
                  <div className="text-left">
                    <h3 className="text-base font-bold">
                      Premium Package (Yearly)
                    </h3>
                    <div className="text-2xl font-bold">
                      $99.99 <span className="text-sm font-normal">/year</span>
                    </div>
                  </div>
                </div>

                <p className="text-left text-sm mb-3">
                  Our Unlimited Package for frequent Chess Players!
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">1,000 Analyses per year</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">
                      Full Access to the Feedback Log
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">Unlimited Puzzles</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">Play vs. AI</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">Board Vision Training</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">Chess Handbook</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary-white w-5 h-5" />
                    <p className="text-left text-sm">Early Feature Update</p>
                  </div>
                </div>

                <button
                  onClick={onGetPremium}
                  className="mt-3 w-full h-10 btn-tertiary rounded-full text-blue-base font-semibold transition-colors text-sm"
                >
                  Get Premium
                </button>
              </div>
            </div>

            {/* Club offer section */}
            <div className="mt-4 mb-4 bg-white p-3 rounded-lg border flex items-center gap-3 text-sm">
              <Users className="w-5 h-5 text-blue-base flex-shrink-0" />
              <p className="text-gray-700 text-left">
                Are you interested in getting an AroundChess Subscription for
                your Chess Club?
                <a href="#" className="text-blue-600 hover:underline ml-1">
                  Click here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
