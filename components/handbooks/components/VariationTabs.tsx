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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processedVariations && processedVariations.length > 0 ? (
            processedVariations.map((variation, index) => (
              <div
                key={variation?.id || `variation-${index}`}
                className="border rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 bg-gray-50">
                  <h3 className="text-sm md:text-base font-bold">
                    {variation?.name || `Variation ${index + 1}`}
                  </h3>
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-600">
                    {variation?.description || "No description available"}
                  </p>

                  {variation?.keyIdeas &&
                  Array.isArray(variation.keyIdeas) &&
                  variation.keyIdeas.length > 0 ? (
                    <div className="mt-3">
                      <ul className="space-y-2">
                        {variation.keyIdeas.map(
                          (
                            keyIdea: { id: any; idea: any },
                            pointIndex: any
                          ) => (
                            <li
                              key={keyIdea?.id || `idea-${pointIndex}`}
                              className="flex items-start gap-2"
                            >
                              <Target className="w-4 h-4 text-blue-base flex-shrink-0 mt-0.5" />
                              <span className="text-xs">
                                {keyIdea?.idea || "No idea specified"}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <h4 className="text-xs font-semibold mb-2">Key Ideas:</h4>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-base flex-shrink-0" />
                        <span className="text-xs">Key ideas coming soon</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border">
              <p>No variations data available for this opening.</p>
              <p className="text-xs mt-2">This could be because:</p>
              <ul className="text-xs list-disc pl-5 mt-1">
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
