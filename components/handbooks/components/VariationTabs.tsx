import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const VariationsTab: React.FC<any> = ({ variations }) => {
  const [processedVariations, setProcessedVariations] = useState<any[]>([]);

  useEffect(() => {
    let processedData: any[] = [];

    try {
      if (Array.isArray(variations)) {
        processedData = variations;
      } else if (variations && typeof variations === "object") {
        processedData = Object.values(variations);
      }
    } catch (error) {
      console.error("Error processing variations:", error);
    }

    setProcessedVariations(processedData);
  }, [variations]);

  return (
    <motion.div
      key="variations"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processedVariations && processedVariations.length > 0 ? (
            processedVariations.map((variation, index) => {
              return (
                <div
                  key={variation?.id || `variation-${index}`}
                  className="border rounded-lg shadow-sm overflow-hidden p-4 flex flex-col h-full"
                >
                  <div className="flex flex-col space-y-3">

                    {variation?.keyIdeas &&
                    Array.isArray(variation.keyIdeas) &&
                    variation.keyIdeas.length > 0 ? (
                      <div>
                        <h3 className="text-[18px] --xs md:text-base font-bold mb-2">
                          {index == 0 ? "Center Control: " : ""}
                          {index == 1 ? "Piece Development: " : ""}
                          {index == 2 ? "King Safety: " : ""}
                        </h3>
                        <p className="text-[15px] --xs text-gray-600 mb-3">
                          {index == 0 ? "The basic approach to controlling the center with pawns and pieces." : ""}
                          {index == 1 ? "Natural development of pieces to active squares." : ""}
                          {index == 2 ? "Ensuring king safety through timely castling and proper pawn structure." : ""}
                        </p>
                        <ul className="space-y-2">
                          {variation.keyIdeas.map(
                            (
                              keyIdea: string | { id: any; idea: any },
                              pointIndex: any
                            ) => {
                              const ideaText = typeof keyIdea === 'string'
                                ? keyIdea
                                : (keyIdea?.idea || "No idea specified");
                              const ideaKey = typeof keyIdea === 'object' && keyIdea?.id
                                ? keyIdea.id
                                : `idea-${pointIndex}`;

                              return (
                                <li
                                  key={ideaKey}
                                  className="flex items-center justify-start gap-x-2"
                                >
                                  <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                                  <span className="text-[15px] --sm">
                                    {ideaText}
                                  </span>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-[14px] --xs font-semibold mb-2">Key Ideas:</h4>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                          <span className="text-[14px] --xs">Key ideas coming soon</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border">
              <p>No variations data available for this opening.</p>
              <p className="text-[14px] --xs mt-2">This could be because:</p>
              <ul className="text-[14px] --xs list-disc pl-5 mt-1">
                <li>This opening doesn't have variations defined</li>
                <li>The data structure doesn't match expected format</li>
                <li>There was an error processing the data</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VariationsTab;
