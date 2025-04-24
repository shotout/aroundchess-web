import Image from "next/image";

interface TableMovementProps {
  myColor: string;
  capturedWhite: { san: string; capturedTheme: string }[];
  capturedBlack: { san: string; capturedTheme: string }[];
  PieceChoosed: string;
}

export const TableMovement = ({ myColor, capturedWhite, capturedBlack, PieceChoosed }: TableMovementProps) => {
  return (
    <table className="w-full table-auto border-separate border-spacing-0 rounded-[8px] border-collapse border-[#BDD0F9]">
      <thead>
        <tr className="bg-[#D7E3FB] ">
          <th className="p-2 border font-normal text-xs border border-[#BDD0F9]">
            #
          </th>
          <th className="p-2 border font-normal text-xs border border-[#BDD0F9]">
            {myColor == "white" ? "You" : "Computer"} (White)
          </th>
          <th className="p-2 border font-normal text-xs border border-[#BDD0F9]">
            {myColor != "white" ? "You" : "Computer"} (Black)
          </th>
        </tr>
      </thead>
      <tbody>
        {capturedWhite &&
          capturedWhite.length > 0 &&
          capturedWhite.map((captured:any, index:any) => {
            let move = captured.san;
            let icon = captured.capturedTheme;
            return (
              <tr className="text-center" key={index}>
                <td
                  className={`p-2 border font-normal text-xs border-[#BDD0F9] ${
                    index + 1 == capturedWhite.length && `rounded-bl-[8px]`
                  }`}
                >
                  {index + 1}
                </td>
                <td className="text-center align-middle p-2 border border-[#BDD0F9] ">
                  {icon.length == 2 && (
                    <Image
                      src={`/pieces/${PieceChoosed}/${icon}.png`}
                      alt="icon"
                      width={1000}
                      height={1000}
                      className="w-[16px] h-[16px] object-contain inline-block"
                    />
                  )}
                  <span className="h-[16px] font-normal text-xs"> {move}</span>
                </td>
                <td
                  className={`text-center align-middle p-2 border border-[#BDD0F9] ${
                    index + 1 == capturedWhite.length && `rounded-br-[8px]`
                  }`}
                >
                  {capturedBlack[index] != null &&
                    capturedBlack[index].capturedTheme.length == 2 && (
                      <Image
                        src={`/pieces/${PieceChoosed}/${capturedBlack[index].capturedTheme}.png`}
                        alt="icon"
                        width={1000}
                        height={1000}
                        className="w-[16px] h-[16px] object-contain inline-block"
                      />
                    )}
                  {capturedBlack[index] != null && (
                    <span className="h-[16px] font-normal text-xs">
                      {" "}
                      {capturedBlack[index].san}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
