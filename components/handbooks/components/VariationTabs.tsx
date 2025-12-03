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
            processedVariations.map((variation, index) => (
              <div
                key={variation?.id || `variation-${index}`}
                className="border rounded-lg shadow-sm overflow-hidden p-4 flex flex-col h-full"
              >
                <div className="flex flex-col space-y-3">
                  {/* <h3 className="text-[14px] --xs md:text-base font-bold">
                    {variation?.name || `Variation ${index + 1}`}:
                  </h3> */}

                  {/* <p className="text-[14px] --xs text-gray-600">
                    {variation?.description || "No description available"}
                  </p> */}

                  {variation?.keyIdeas &&
                  Array.isArray(variation.keyIdeas) &&
                  variation.keyIdeas.length > 0 ? (
                    <div>
                      <ul className="space-y-2">
                        {variation.keyIdeas.map(
                          (
                            keyIdea: { id: any; idea: any },
                            pointIndex: any
                          ) => (
                            <li
                              key={keyIdea?.id || `idea-${pointIndex}`}
                              className="flex items-center justify-start gap-x-2"
                            >
                              <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                              <span className="text-[14px] --sm">
                                {keyIdea?.idea || "No idea specified"}
                              </span>
                            </li>
                          )
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
            ))
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
