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
