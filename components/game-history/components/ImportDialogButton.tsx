import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Trash } from "lucide-react";
import type { AxiosProgressEvent } from "axios";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { gameHistoryApi } from "../services/api";
import { useProfileStore } from "@/app/store/profile";
import { useGames } from "../hooks/useGameData";

interface ImportDialogButtonProps {
  onSuccess?: () => void;
}

const ImportDialogButton: React.FC<ImportDialogButtonProps> = ({
  onSuccess,
}) => {
  const { sessionId } = useProfileStore();
  const { addOtherImportedGame, username } = usePgnStore();
  const { handleForceRefresh } = useGames("other");

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("paste");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isConfirmationMode, setIsConfirmationMode] =
    useState<boolean>(false);
  const [isOperationCompleted, setIsOperationCompleted] =
    useState<boolean>(false);

  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileContent, setFileContent] = useState<string>("");
  const [pgnText, setPgnText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [importedGameId, setImportedGameId] = useState<string | null>(null);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    []
  );

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

  const handleButtonClick = useCallback(() => {
    if (activeTab === "upload" && !fileName) {
      fileInputRef.current?.click();
    } else if (
      (activeTab === "paste" && pgnText.trim()) ||
      (activeTab === "upload" && fileName)
    ) {
      setIsSubmitted(true);
      setIsConfirmationMode(true);
    }
  }, [activeTab, fileName, pgnText]);

  const handleAnalyzeButtonClick = useCallback(async () => {
    if (!isConfirmationMode) return;
    setIsLoading(true);
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      const content = activeTab === "paste" ? pgnText : fileContent;
      if (!content) {
        throw new Error("No PGN content available");
      }
      formData.append("pgn", content);
      if (username) {
        formData.append("username", username);
      }
      const response = await gameHistoryApi.importGame(
        "game_history",
        formData,
        sessionId ?? null,
        (ev: AxiosProgressEvent) => {
          const pct = Math.round((ev.loaded * 100) / (ev.total || 1));
          setUploadProgress(pct);
        }
      );
      if (!response?.data) {
        throw new Error("Invalid response from server");
      }
      const gameData = { ...response.data, pgn: content };
      const newGame = addOtherImportedGame(gameData);
      setImportedGameId(newGame.id.toString());
      setIsOperationCompleted(true);
      setIsConfirmationMode(false);
      setIsUploading(false);
      toast.success("Game imported successfully!");
      handleForceRefresh();
      setTimeout(() => {
        resetDialog();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setError(msg);
      toast.error(`Import failed: ${msg}`);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  }, [
    activeTab,
    pgnText,
    fileContent,
    username,
    sessionId,
    isConfirmationMode,
    addOtherImportedGame,
    handleForceRefresh,
    resetDialog,
    onSuccess,
  ]);

  const handleRemoveFile = useCallback(() => {
    setFileName("");
    setFileSize(0);
    setFileContent("");
    setError(null);
    setUploadedFile(null);
  }, []);

  const handleCancelConfirmation = useCallback(() => {
    setIsSubmitted(false);
    setIsConfirmationMode(false);
  }, []);

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

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  return (
    <div>
      <button
        type="button"
        className="flex justify-center items-center gap-1 lg:gap-2 py-[20px] px-1 rounded-3xl btn-primary w-[130px] md:w-[140px] h-[36px] lg:w-[200px] lg:h-[48px] font-primary"
        onClick={() => setOpenDialog(true)}
      >
        <Upload className="h-[20px]" />
        <h1 className="text-[14px] --xs lg:text-[14px] --sm font-primary">Import Games</h1>
      </button>

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

            <div className="px-6 py-4">
              {isSubmitted ? (
                <SuccessView {...getSuccessViewProps()} />
              ) : (
                <>
                  <p className="text-[14px] --sm text-center max-w-2xl mx-auto text-gray-700 mb-6">
                    Upload your previous Game's{" "}
                    <span className="font-bold">PGN</span> for a detailed
                    analysis. You can either paste your{" "}
                    <span className="font-bold">PGN</span> directly or upload a{" "}
                    <span className="font-bold">PGN</span> file.
                  </p>

                  <Card className="flex gap-3 mt-5 bg-[#F9FAFC] border-2 border-gray-100 p-1">
                    <button
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-[14px] --sm ${
                        activeTab === "paste"
                          ? "bg-white border shadow-sm border-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTabChange("paste")}
                    >
                      <span>Paste PGN</span>
                    </button>
                    <button
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-[14px] --sm ${
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

                  <div className="mt-5 h-[200px]">
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
                                  <div className="text-gray-800">{fileName}</div>
                                  <div className="text-gray-500 text-[14px] --sm">
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
                                    <span className="text-blue-base font-semibold text-[14px] --sm">
                                      {uploadProgress}%
                                    </span>
                                  </div>
                                </div>
                                <div className="text-[14px] --xs text-center mt-1">
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
                              <div className="text-gray-500 text-[14px] --sm">
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

                  {error && (
                    <div className="mt-2 text-red-500 text-[14px] --sm">{error}</div>
                  )}

                  {activeTab === "upload" && (
                    <div className="flex justify-between mt-2 text-[14px] --sm">
                      <span>
                        Supported Format: <span className="font-bold">PGN</span>
                      </span>
                      <span>
                        Max Size: <span className="font-bold">5MB</span>
                      </span>
                    </div>
                  )}

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
  description =
    "Your PGN was successfully uploaded. You can now analyze your Game with our Advanced Chess Engine!",
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

      <h3 className="text-xl font-semibold text-gray-800 mb-1">
        {title}
      </h3>
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