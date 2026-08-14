"use client";

import { useComputerChessStore } from "../../store/computerChessStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../Components/ui/dialog";
import { Button } from "../../Components/ui/button";
import Image from "next/image";

export function ChooseColor() {
  const {
    computer,
    updateComputer,
    computerMove,
    updateTargetELO,
  } = useComputerChessStore((state) => state);
  
  if (computer) return null;

  return (
    <Dialog open={true}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-54">
        <DialogHeader>
          <DialogTitle className="flex text-gray-400 justify-center mb-5">
            Computer strength
          </DialogTitle>
          <DialogDescription>
            <div className="flex gap-4 flex-col">
              <div className="flex gap-2">
                <Button onClick={() => updateTargetELO(1000)}>1</Button>
                <Button onClick={() => updateTargetELO(1200)}>2</Button>
                <Button onClick={() => updateTargetELO(1400)}>3</Button>
                <Button onClick={() => updateTargetELO(1600)}>4</Button>
                <Button onClick={() => updateTargetELO(1800)}>5</Button>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <Button
                  className="py-8"
                  variant={"outline"}
                  onClick={() => {
                    updateComputer("black");
                  }}
                >
                  <Image
                    src="/default/white/K.png"
                    alt="computer"
                    width={40}
                    height={40}
                  />
                </Button>
                <Button
                  className="py-8"
                  variant={"outline"}
                  onClick={() => {
                    updateComputer("white");
                  }}
                >
                  <Image
                    src="/default/black/k.png"
                    alt="computer"
                    width={40}
                    height={40}
                  />
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
