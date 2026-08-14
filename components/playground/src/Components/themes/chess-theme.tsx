"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../Components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useThemeStore } from "../../store/playground/theme-store";
import {
  blueWhiteBoardTheme,
  defaultBoardTheme,
  greenWhiteBoardTheme,
  woodBoardTheme,
} from "../../utils/boardThemes/board-themes";
import { Button } from "../../Components/ui/button";

export function ChessTheme() {
  const { setPieceTheme, pieceTheme, boardTheme, setBoardTheme } =
    useThemeStore((state) => state);

  const getCurrentTheme = () => {
    if (boardTheme.light === defaultBoardTheme.light) return "default";
    if (boardTheme.light === greenWhiteBoardTheme.light) return "green-white";
    if (boardTheme.light === blueWhiteBoardTheme.light) return "blue-white";
    if (boardTheme.light === woodBoardTheme.light) return "wood";
    return "default";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-2 cursor-pointer" variant={"ghost"}>
          <Palette />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 dark:bg-black/50 bg-white backdrop-blur-md rounded-lg p-2 shadow-lg">
        <DropdownMenuLabel>
          <h2 className="text-lg font-semibold">Chess Theme</h2>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={pieceTheme}
          onValueChange={(value: any) => setPieceTheme(value)}
        >
          <DropdownMenuRadioItem value="default">default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="classic">classic</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="crownforge">
            crownforge
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <h2 className="text-lg font-semibold">Board Theme</h2>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={getCurrentTheme()}
          onValueChange={(value) => {
            if (value === "default") setBoardTheme(defaultBoardTheme);
            else if (value === "green-white") setBoardTheme(greenWhiteBoardTheme);
            else if (value === "blue-white") setBoardTheme(blueWhiteBoardTheme);
            else if (value === "wood") setBoardTheme(woodBoardTheme);
          }}
        >
          <DropdownMenuRadioItem value="default">default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="green-white">
            green-white
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="blue-white">
            blue-white
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="wood">wood</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
