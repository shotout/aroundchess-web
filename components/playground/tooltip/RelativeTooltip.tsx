import { Info, X } from "lucide-react";

type RelativeTooltipProps = {
  onClose?: () => void;
  tipLabel?: string;
};

export const RelativeTooltip = ({
  onClose,
  tipLabel,
}: RelativeTooltipProps) => {
  return (
    <div className="absolute -top-16 left-12 w-[188px] border border-[#221AE9] bg-[#ECEBFF] rounded-[8px] rounded-bl-[0px]">
      <div className="text-[#0B094e] px-4 py-3 rounded-lg shadow-lg max-w-xs">
        <div className="flex items-start gap-2">
          <Info className="w-[16px] h-[16px] flex-shrink-0" color="#221AE9" />
          <div className="flex-1">
            <p className="text-[11px] font-normal">
              {tipLabel
                ? tipLabel
                : "Need some help? Click here to get a hint."}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-0.5 rounded transition-colors"
              aria-label="Close tooltip"
            >
              <X className="w-[14px] h-[14px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
