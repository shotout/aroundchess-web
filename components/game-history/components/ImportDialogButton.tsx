import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Trash } from "lucide-react";
import type { AxiosProgressEvent } from "axios";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { gameHistoryApi, refetchGameData } from "../services/api";
import { useProfileStore } from "@/app/store/profile";

interface ImportDialogButtonProps {
  onSuccess?: () => void;
}

const ImportDialogButton: React.FC<ImportDialogButtonProps> = ({
  onSuccess,
}) => {
  const { sessionId } = useProfileStore();

  const { addImportedGame } = usePgnStore();

  // Dialog state
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("paste");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isConfirmationMode, setIsConfirmationMode] = useState<boolean>(false);
  const [isOperationCompleted, setIsOperationCompleted] =
    useState<boolean>(false);

  // File state
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileContent, setFileContent] = useState<string>("");
  const [pgnText, setPgnText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [importedGameId, setImportedGameId] = useState<string | null>(null);

  // Drag and drop state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the dialog to initial state
  const resetDialog = useCallback(() => {
    setIsSubmitted(false);
    setOpenDialog(false);
    setPgnText("");
    setFileName("");
    setFileSize(0);
    setActiveTab("paste");
    setIsUploading(false);
    setUploadProgress(0);
    setFileContent("");
    setError(null);
    setIsLoading(false);
    setImportedGameId(null);
    setUploadedFile(null);
    setIsConfirmationMode(false);
    setIsOperationCompleted(false);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setPgnText("");
    setFileName("");
    setFileSize(0);
    setIsSubmitted(false);
    setIsUploading(false);
    setUploadProgress(0);
    setFileContent("");
    setError(null);
    setUploadedFile(null);
    setIsConfirmationMode(false);
    setIsOperationCompleted(false);
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file input change
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    []
  );

  // Process file
  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".pgn")) {
      toast.error("Please upload a PGN file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setFileContent(e.target.result);
      }
    };
    reader.readAsText(file);
  }, []);

  // Handle button click (either to select file or show confirmation)
  const handleButtonClick = useCallback(() => {
    if (activeTab === "upload" && !fileName) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else if (
      (activeTab === "paste" && pgnText.trim()) ||
      (activeTab === "upload" && fileName)
    ) {
      // Show confirmation view instead of submitting
      setIsSubmitted(true);
      setIsConfirmationMode(true);
    }
  }, [activeTab, fileName, pgnText]);

  // Handle analyze button click (actual form submission)
  const handleAnalyzeButtonClick = useCallback(async () => {
    // If we're in confirmation mode, this is the actual submission
    if (isConfirmationMode) {
      setIsLoading(true);
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Prepare request data
        const requestData = new FormData();
        if (activeTab === "paste") {
          // For pasted PGN - use the text directly
          requestData.append("pgn", pgnText);
        } else if (activeTab === "upload" && fileContent) {
          // For uploaded PGN file - use the file content, not the File object
          requestData.append("pgn", fileContent);
        } else {
          throw new Error("No PGN content available");
        }

        // Send to API
        const response = await gameHistoryApi.importGame(
          requestData,
          sessionId ?? null,
          (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          }
        );

        // Get PGN content from either source
        const pgnContent = activeTab === "paste" ? pgnText : fileContent;

        // Process response data for store
        let gameData;
        if (response && response.data) {
          // If API returns game data, use it
          gameData = response.data;

          // If PGN is not included, add it
          if (!gameData.pgn) {
            gameData.pgn = pgnContent;
          }
        } else {
          // Create a minimal game object if no data returned
          gameData = {
            date: new Date().toISOString().slice(0, 10),
            opponent: "Unknown",
            result: "DRAW",
            eloChange: "(+0 ELO Rating)",
            resultColor: "text-gray-500",
            rating: "0",
            opening: "Unknown Opening",
            moves: "0",
            timeControl: "?",
            source: "PGN Upload",
            color: "White",
            gameFormat: "PGN Upload",
            gameType: "standard",
            pgn: pgnContent,
          };
        }

        // Add to store
        const newGame = addImportedGame(gameData);
        console.log("Game added to store:", newGame);

        setImportedGameId(newGame.id.toString());
        setIsOperationCompleted(true);
        setIsConfirmationMode(false);
        setIsUploading(false);

        toast.success("Game imported successfully!");

        // Close dialog and refresh after a delay
        setTimeout(() => {
          resetDialog();
          if (onSuccess) onSuccess();
          // window.location.reload();
          refetchGameData(sessionId ?? null, "other").then(() => {
            console.log("Game data refetched successfully");
          });
        }, 2000);
      } catch (err) {
        console.error("Error importing game:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to import PGN data";
        setError(errorMessage);
        toast.error(`Import failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
        setIsUploading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    fileContent,
    fileName,
    pgnText,
    resetDialog,
    addImportedGame,
    sessionId,
    uploadedFile,
    isConfirmationMode,
    onSuccess,
  ]);

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setFileName("");
    setFileSize(0);
    setFileContent("");
    setError(null);
    setUploadedFile(null);
  }, []);

  // Handle cancellation of confirmation
  const handleCancelConfirmation = useCallback(() => {
    setIsSubmitted(false);
    setIsConfirmationMode(false);
  }, []);

  // Get customized success view props based on current mode
  const getSuccessViewProps = () => {
    if (isConfirmationMode) {
      return {
        resetDialog: handleCancelConfirmation,
        handleAnalyzeButtonClick,
        isLoading,
        error,
        title: "Confirm PGN Import",
        description: `Are you sure you want to import this ${
          activeTab === "paste" ? "PGN data" : "file"
        }? You can analyze it after import.`,
        buttonText: "Import PGN",
        backButtonText: "Go Back",
      };
    } else {
      return {
        resetDialog,
        handleAnalyzeButtonClick,
        isLoading,
        error,
        title: "Your Import was successful!",
        description:
          "Your PGN was successfully uploaded. You can now analyze your Game with our Advanced Chess Engine!",
        buttonText: "Analyze Game",
        backButtonText: "Back to Game History",
      };
    }
  };

  // Calculate positioning (same as AnalyzeGameHistory)
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  return (
    <div>
      {/* Import Button */}
      <button
        type="button"
        className="flex justify-center items-center gap-1 lg:gap-2 py-[20px] px-1 rounded-3xl btn-primary w-[130px] md:w-[140px] h-[36px] lg:w-[200px] lg:h-[48px] font-primary"
        onClick={() => setOpenDialog(true)}
      >
        <Upload className="h-[20px]" />
        <h1 className="text-xs lg:text-sm font-primary">Import Games</h1>
      </button>

      {/* Dialog Overlay */}
      {openDialog && (
        <div
          className="fixed bg-black/25 z-50 flex items-center justify-center p-4 md:p-0"
          style={{
            top:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? headerHeightLg
                : headerHeight,
            left: sidebarWidth,
            right: 0,
            bottom: 0,
          }}
          onClick={resetDialog}
        >
          <div
            className="w-full mx-auto rounded-lg max-w-sm md:max-w-xl bg-white overflow-y-auto max-h-[95%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-4">
              <div className="w-6"></div>
              <h2 className="text-xl font-semibold text-center flex-1">
                Import a Game
              </h2>
              <button
                type="button"
                onClick={resetDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="px-6 py-4">
              {isSubmitted ? (
                <SuccessView {...getSuccessViewProps()} />
              ) : (
                <>
                  {/* Instructions */}
                  <p className="text-sm text-center max-w-2xl mx-auto text-gray-700 mb-6">
                    Upload your previous Game's{" "}
                    <span className="font-bold">PGN</span> for a detailed
                    analysis. You can either paste your{" "}
                    <span className="font-bold">PGN</span> directly or upload a{" "}
                    <span className="font-bold">PGN</span> file.
                  </p>

                  {/* Tab Selector */}
                  <Card className="flex gap-3 mt-5 bg-[#F9FAFC] border-2 border-gray-100 p-1">
                    <button
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-sm ${
                        activeTab === "paste"
                          ? "bg-white border shadow-sm border-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTabChange("paste")}
                    >
                      <span>Paste PGN</span>
                    </button>
                    <button
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-sm ${
                        activeTab === "upload"
                          ? "bg-white border shadow-sm border-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTabChange("upload")}
                    >
                      <Upload className="h-4 w-4" />
                      Upload File
                    </button>
                  </Card>

                  {/* Tab Content */}
                  <div className="mt-5 h-[200px]">
                    {/* Paste Tab */}
                    {activeTab === "paste" && (
                      <div className="h-full border-2 border-dashed border-gray-100 rounded-lg bg-gray-50 p-2">
                        <textarea
                          className="w-full h-full bg-transparent p-2 resize-none outline-none text-gray-700 placeholder-gray-400"
                          placeholder="Paste your PGN here..."
                          value={pgnText}
                          onChange={(e) => setPgnText(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Upload Tab - Empty State */}
                    {activeTab === "upload" && !fileName && (
                      <div
                        className={`h-full border-2 border-dashed ${
                          dragActive
                            ? "border-blue-base bg-blue-base/10"
                            : "border-blue-base bg-blue-base/5"
                        } rounded-lg flex flex-col items-center justify-center`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept=".pgn"
                          onChange={handleFileInput}
                        />
                        <div className="text-center flex flex-col items-center justify-center">
                          <Image
                            width={64}
                            height={64}
                            alt=""
                            src={"/my-game-history/upload.png"}
                          />
                          <p className="text-gray-700 mb-1">
                            <span className="underline">
                              Drag & drop or click
                            </span>
                          </p>
                          <p className="text-gray-700">
                            to{" "}
                            <span
                              className="text-blue-base font-medium cursor-pointer underline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              select
                            </span>{" "}
                            a file
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Upload Tab - File Selected */}
                    {activeTab === "upload" && fileName && (
                      <div className="h-full border-2 border-dashed border-blue-base bg-blue-base/5 rounded-lg p-4 flex flex-col justify-center items-center">
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
                            <div className="flex w-full h-auto items-center bg-primary-white border shadow-md p-4 rounded-md">
                              <div className="flex items-center flex-1">
                                <div className="bg-blue-100 rounded-md p-3 mr-3">
                                  <h1 className="text-blue-500 font-bold text-lg">
                                    PGN
                                  </h1>
                                </div>
                                <div className="flex flex-col">
                                  <div className="text-gray-800">
                                    {fileName}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    {(fileSize / 1024).toFixed(1)} KB
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="relative w-16 h-16">
                                  <svg
                                    className="w-full h-full"
                                    viewBox="0 0 100 100"
                                  >
                                    <circle
                                      className="text-gray-200"
                                      strokeWidth="10"
                                      stroke="currentColor"
                                      fill="transparent"
                                      r="40"
                                      cx="50"
                                      cy="50"
                                    />
                                    <circle
                                      className="text-blue-base"
                                      strokeWidth="10"
                                      strokeDasharray="251.2"
                                      strokeDashoffset={
                                        251.2 - (251.2 * uploadProgress) / 100
                                      }
                                      strokeLinecap="round"
                                      stroke="currentColor"
                                      fill="transparent"
                                      r="40"
                                      cx="50"
                                      cy="50"
                                      transform="rotate(-90 50 50)"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-blue-base font-semibold text-sm">
                                      {uploadProgress}%
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-center mt-1">
                                  uploading file...
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center w-full">
                            <div className="bg-blue-100 rounded-md p-4 mr-3">
                              <div className="text-blue-500 font-bold text-lg">
                                PGN
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-gray-800">{fileName}</div>
                              <div className="text-gray-500 text-sm">
                                {(fileSize / 1024).toFixed(1)} KB
                              </div>
                            </div>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={handleRemoveFile}
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-2 text-red-500 text-sm">{error}</div>
                  )}

                  {/* File Format Info */}
                  {activeTab === "upload" && (
                    <div className="flex justify-between mt-2 text-sm">
                      <span>
                        Supported Format: <span className="font-bold">PGN</span>
                      </span>
                      <span>
                        Max Size: <span className="font-bold">5MB</span>
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    className={`w-full mt-5 py-4 rounded-3xl flex items-center justify-center ${
                      (activeTab === "paste" && pgnText.trim()) ||
                      (activeTab === "upload" && fileName && !isUploading)
                        ? "btn-primary text-white"
                        : isUploading || isLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "btn-primary text-white"
                    }`}
                    onClick={handleButtonClick}
                    disabled={isUploading || isLoading}
                  >
                    {activeTab === "upload" && !fileName
                      ? "Select File"
                      : isUploading
                      ? "Uploading..."
                      : isLoading
                      ? "Processing..."
                      : "Import Game"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Success/Confirmation View Component
interface SuccessViewProps {
  resetDialog: () => void;
  handleAnalyzeButtonClick: () => void;
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  buttonText?: string;
  backButtonText?: string;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  resetDialog,
  handleAnalyzeButtonClick,
  isLoading,
  error,
  title = "Your Import was successful!",
  description = "Your PGN was successfully uploaded. You can now analyze your Game with our Advanced Chess Engine!",
  buttonText = "Analyze Game",
  backButtonText = "Back to Game History",
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image
          src={"/my-game-history/pawn.png"}
          width={200}
          height={200}
          alt=""
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-center mb-6">{description}</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex w-full gap-3">
        <button
          className="flex-1 py-3 btn-secondary font-medium rounded-full"
          onClick={resetDialog}
          disabled={isLoading}
        >
          {backButtonText}
        </button>
        <button
          className="flex-1 py-3 btn-primary text-white font-medium rounded-full"
          onClick={handleAnalyzeButtonClick}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : buttonText}
        </button>
      </div>
    </div>
  );
};

export default ImportDialogButton;
