import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface PatternsTabProps {
  lesson: any;
}

const PatternsTab: React.FC<PatternsTabProps> = ({ lesson }) => {
  const patterns = lesson?.patterns || {};

  const commonPatterns = patterns?.commonPatterns || [];
  const tacticalMotifs = patterns?.tacticalMotifs || [];
  const fundamentalPositions = patterns?.fundamentalPositions || [];
  const winningTechniques = patterns?.winningTechniques || [];

  const hasMiddlegameData =
    commonPatterns.length > 0 || tacticalMotifs.length > 0;
  const hasEndgameData =
    fundamentalPositions.length > 0 || winningTechniques.length > 0;

  if (hasEndgameData) {
    return (
      <motion.div
        key="patterns"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col h-full p-4 gap-y-3">
              <h3 className="text-[14px] --sm md:text-base font-bold">
                Fundamental Positions
              </h3>

              <div className="flex-grow">
                {fundamentalPositions.length > 0 ? (
                  <ul className="space-y-2">
                    {fundamentalPositions.map(
                      (position: any, index: number) => (
                        <li
                          key={position?.id || `position-${index}`}
                          className="flex items-center gap-x-2"
                        >
                          <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                          <span className="text-[14px] --xs">{position.position}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                    <span className="text-[14px] --xs">
                      Fundamental positions coming soon
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Winning Techniques Section */}
            <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col h-full p-4 gap-y-3">
              <h3 className="text-[14px] --sm md:text-base font-bold">
                Winning Techniques
              </h3>

              <div className="flex-grow">
                {winningTechniques.length > 0 ? (
                  <ul className="space-y-2">
                    {winningTechniques.map((technique: any, index: number) => (
                      <li
                        key={technique?.id || `technique-${index}`}
                        className="flex items-center gap-x-2"
                      >
                        <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                        <span className="text-[14px] --xs">{technique.technique}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                    <span className="text-[14px] --xs">
                      Winning techniques coming soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // For lessons with middlegame data (regardless of category)
  if (hasMiddlegameData) {
    return (
      <motion.div
        key="patterns"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Patterns Section */}
            <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col gap-y-3 h-full p-4">
              <h3 className="text-[14px] --sm md:text-base font-bold">
                Common Patterns
              </h3>

              <div className="flex-grow">
                {commonPatterns.length > 0 ? (
                  <ul className="space-y-2">
                    {commonPatterns.map((pattern: any, index: number) => (
                      <li
                        key={pattern?.id || `pattern-${index}`}
                        className="flex items-center gap-2"
                      >
                        <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                        <span className="text-[14px] --xs">{pattern.pattern}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                    <span className="text-[14px] --xs">Common patterns coming soon</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tactical Motifs Section */}
            <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col h-full gap-y-3 p-4">
              <h3 className="text-[14px] --sm md:text-base font-bold">
                Tactical Motifs
              </h3>

              <div className="flex-grow">
                {tacticalMotifs.length > 0 ? (
                  <ul className="space-y-2">
                    {tacticalMotifs.map((motif: any, index: number) => (
                      <li
                        key={motif?.id || `motif-${index}`}
                        className="flex items-center gap-x-2"
                      >
                        <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                        <span className="text-[14px] --xs">{motif.motif}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                    <span className="text-[14px] --xs">Tactical motifs coming soon</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="patterns"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-6">
        <div className="col-span-1 md:col-span-2 text-gray-600 p-4 border rounded-lg">
          <p>No pattern data was found for this lesson.</p>
          <p className="text-[14px] --xs mt-2">Pattern data availability:</p>
          <ul className="text-[14px] --xs list-disc pl-5 mt-1">
            <li>Common patterns: {commonPatterns.length}</li>
            <li>Tactical motifs: {tacticalMotifs.length}</li>
            <li>Fundamental positions: {fundamentalPositions.length}</li>
            <li>Winning techniques: {winningTechniques.length}</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default PatternsTab;
