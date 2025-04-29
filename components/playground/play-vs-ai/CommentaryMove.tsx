import { toSentenceCase } from "@/functions/sentence-case";
import { fadeInUp, motion } from "@/utils/motion";

import Image from "next/image";
interface CommentaryMoveProps {
  classify: string;
}
export const CommentaryMove = ({ classify }: CommentaryMoveProps) => {
  return (
    <Image
      src={`/images/play-vs-ai/${classify}.gif`}
      alt="GIF"
      width={244}
      height={44}
      unoptimized={true}
    />
  );
};
//   export const CommentaryMove = ({ classify }: CommentaryMoveProps) => {
//   let gradColor =
//     classify == "best" || "brilliant" || "excellent" || "good"
//       ? `bg-[linear-gradient(to_right,_#27C2A3,_#27C2A3,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#14A574)]`
//       : classify == "mistake"
//       ? `bg-[linear-gradient(to_right,_#FFFFFF58,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#FFFFFF40)]`
//       : `bg-[linear-gradient(to_right,_#FFFFFF58,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#FFFFFF40)]`;
//   let color =
//     classify == "best" || "brilliant" || "excellent" || "good"
//       ? "#00B427"
//       : classify == "mistake"
//       ? "#221AE9"
//       : "#C01B1B";
//   let icon =
//     classify == "best" || "brilliant" || "excellent" || "good"
//       ? "best-icon"
//       : classify == "mistake"
//       ? "mistake-icon"
//       : "bad-icon";
//   let sparks =
//     classify == "best" || "brilliant" || "excellent" || "good"
//       ? "best-sparks"
//       : classify == "mistake"
//       ? "mistake-sparks"
//       : "bad-sparks";

//   let content =
//     classify == "best" || "brilliant" || "excellent" || "good"
//       ? "Best Move: "
//       : classify == "mistake"
//       ? "Miss Move: "
//       : "Bad Move: ";
//   return (
//     <motion.div
//       initial={{ rotateX: 180 }}
//       animate={{ opacity: 1, rotateX: 360 }}
//       transition={{
//         duration: 0.6,
//         stiffness: 500,
//         damping: 30,
//         ease: [0.4, 0.0, 0.2, 1],
//         type: "tween",
//       }}
//       className={`relative min-w-[238px] mt-4 rounded-[8px] ${gradColor} border border-[${color}] p-[1px]`}
//     >
//       <div
//         className={`flex flex-row items-center rounded-[8px] border-2 border-dotted border-white gap-2`}
//       >
//         <Image
//           src={`/images/play-vs-ai/${icon}.png`}
//           alt="icon"
//           width={1000}
//           height={1000}
//           className="w-[20px] h-[20px] object-contain m-[8px] mr-0"
//         />
//         <span className="font-extralight text-[12px] text-white">
//           {toSentenceCase(content)}
//         </span>
//         <span className="font-bold text-[12px] text-white">
//           {classify.toUpperCase()}
//         </span>
//         <div className="absolute right-4 top-0 bottom-1 h-full flex items-center justify-center">
//           <Image
//             src={`/images/play-vs-ai/${sparks}.png`}
//             alt="icon"
//             width={1000}
//             height={1000}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// };
