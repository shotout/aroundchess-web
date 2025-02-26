import AnalysisLatestGame from "./AnalysisLatestGame";
import AnalysisResult from "./AnalysisResult";
import { SiteHeaderAnalysis } from "./site-header-analysis";

export default function AnalysisPage() {
  return (
    <>
      <SiteHeaderAnalysis />
      <AnalysisResult />
      <AnalysisLatestGame />
    </>
  );
}
