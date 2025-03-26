"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface PremiumSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onGetPremium: () => void;
}

export const PremiumSubscriptionDialog = ({
  open,
  onOpenChange,
  onClose,
  onGetPremium,
}: PremiumSubscriptionDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[700px] bg-blue-50 border border-blue-100  overflow-y-scroll max-h-screen"
        onEscapeKeyDown={handleClose}
        onInteractOutside={handleClose}
      >
        {/* Header */}
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold">
            Go Premium now
          </DialogTitle>
          <p className="text-base">
            for unlimited access and become a Chess Master
          </p>
        </DialogHeader>

        {/* Features section */}
        <div className="text-center px-4 pb-4">
          <p className="text-sm text-gray-700 mb-3">
            Discover our Suite of Powerful Features with the AroundChess{" "}
            <span className="text-indigo-600 font-medium">
              Premium Subscription:
            </span>
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
            {/* Feature icons */}
            <div className="bg-white p-2 rounded-lg border border-indigo-200 flex flex-col items-center">
              <Cat className="w-8 h-8 mb-1 text-indigo-600" />
              <p className="text-xs font-medium">Analyze Games</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-indigo-200 flex flex-col items-center">
              <Book className="w-8 h-8 mb-1 text-indigo-600" />
              <p className="text-xs font-medium">Chess Theory</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-indigo-200 flex flex-col items-center">
              <Bot className="w-8 h-8 mb-1 text-indigo-600" />
              <p className="text-xs font-medium">Play VS AI</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-indigo-200 flex flex-col items-center">
              <Settings className="w-8 h-8 mb-1 text-indigo-600" />
              <p className="text-xs font-medium">Chess Puzzles</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-indigo-200 flex flex-col items-center">
              <Target className="w-8 h-8 mb-1 text-indigo-600" />
              <p className="text-xs font-medium">Board Vision</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-indigo-200 flex flex-col items-center">
              <Zap className="w-8 h-8 mb-1 text-indigo-600" />
              <p className="text-xs font-medium">Endgame Training</p>
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
                  <div className="text-indigo-600 mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">1 Game Analysis every 72h</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-indigo-600 mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">
                    Limited Access to the Feedback Log
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-indigo-600 mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">20 Puzzles per month</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-indigo-600 mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Play vs. AI</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-indigo-600 mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Board Vision Training</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-indigo-600 mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Chess Handbook</p>
                </div>
              </div>

              <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <p className="text-left text-sm">You are on this Package.</p>
              </div>
            </div>

            {/* Premium package */}
            <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 px-3 py-0.5 rounded-full text-xs font-medium">
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
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">1,000 Analyses per year</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">
                    Full Access to the Feedback Log
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Unlimited Puzzles</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Play vs. AI</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Board Vision Training</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Chess Handbook</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-white mt-0.5 text-sm">✓</div>
                  <p className="text-left text-sm">Early Feature Update</p>
                </div>
              </div>

              <Button
                onClick={onGetPremium}
                className="mt-3 w-full h-10 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors text-sm"
                variant="outline"
              >
                Get Premium
              </Button>
            </div>
          </div>

          {/* Club offer section */}
          <div className="mt-4 bg-white p-3 rounded-lg border flex items-center gap-3 text-sm">
            <Users className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <p className="text-gray-700 text-left">
              Are you interested in getting an AroundChess Subscription for your
              Chess Club?
              <a href="#" className="text-blue-600 hover:underline ml-1">
                Click here
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
