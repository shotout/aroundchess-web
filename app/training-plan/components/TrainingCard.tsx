import { TrainingPlanCardProps } from "./types";
import Image from "next/image";

const TrainingPlanCard: React.FC<TrainingPlanCardProps> = ({
  onCreatePlan,
  hasPlan,
  disabled,
}) => {
  return (
    <div className="relative w-full h-full p-8 bg-gradient-to-b from-[#EAEAEA] via-white to-[#EAEAEA] flex items-center justify-center border lg:rounded-md overflow-hidden">
      <Image
        src="/training-plan/background.jpg"
        alt="Chess background"
        fill
        priority
        className="object-cover opacity-60"
      />

      <div className="w-full p-8 xl:max-w-[643px] 2xl:max-w-[700px] sm:mx-7 bg-white/70 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-64 border-2 border-[#fff] rounded-md flex flex-col gap-2 items-center justify-center">
        <Image
          src={"/training-plan/check-big.png"}
          alt="background"
          width={100}
          height={100}
        />
        <span className="font-medium text-lg xl:text-xl">
          Create Your Training Plan
        </span>
        <span className="font-normal text-md xl:mx-20 text-center">
          You have not set your Training Plan yet. Click the Button below to
          create your Training Plan.
        </span>
        <button
          className="btn-primary w-full p-2 rounded-full disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onCreatePlan}
          disabled={disabled}
        >
          Create Your Training Plan
        </button>
      </div>
    </div>
  );
};

export default TrainingPlanCard;
