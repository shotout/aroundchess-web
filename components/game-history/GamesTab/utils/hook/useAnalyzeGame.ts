// useAnalyzeGame.ts
import { useRouter } from "next/navigation";
import { Game, usePgnStore} from "@/app/store/zustandStore";
import { toast } from "sonner";
import { proceedAnalysis } from "@/utils/stockfish-utils";

interface UseAnalyzeGameResult {
  handleAnalyzeClick: (game: Game) => Promise<void>;
}

export function useAnalyzeGame(
  username: string | null,
  setPgn: (pgn: string) => void,
  setDataAnalysis: (data: any) => void,
  setIsLoading: (loading: boolean) => void
): UseAnalyzeGameResult {
  const router = useRouter();
  const {setIsLoading : ZustandSetIsLoading} = usePgnStore()

  const handleAnalyzeClick = async (game: Game) => {
    let arr = null;
    try {
      setIsLoading(true);
      ZustandSetIsLoading(true)
      setPgn(game.pgn);
      const responseAnalysis = await proceedAnalysis(
        game.pgn,
        username ?? undefined,
        15,
        60000
      );
      setDataAnalysis(responseAnalysis.data);
      arr = responseAnalysis.data;
      router.push("/analysis");
    } catch (err) {
      setDataAnalysis(null);
      setIsLoading(false);
      ZustandSetIsLoading(false)
      toast.error(err + "");
      router.push("/");
    } finally {
      if (arr != null) {
        router.push("/analysis");
      } else {
        setIsLoading(false);
        ZustandSetIsLoading(false)
      }
    }
  };

  return {
    handleAnalyzeClick
  };
}