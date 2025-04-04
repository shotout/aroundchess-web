import React, { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import {
  DialogHeader,
  DialogInstructions,
  TabSelector,
  PasteTab,
  DragDropArea,
  UploadProgress,
  UploadedFile,
  FileFormatInfo,
  SubmitButton,
  SuccessView,
} from "./Dialog/DialogComponents";
import useGameStore from "./Dialog/DialogStore";
import { useAuth } from "@clerk/nextjs";

const endpoint = process.env.NEXT_PUBLIC_BASE_AUTH || "";

interface Game {
  id: string;
  [key: string]: any;
}

const DialogButton: React.FC = () => {
  const { sessionId } = useAuth();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pgnText, setPgnText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("paste");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileContent, setFileContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importedGameId, setImportedGameId] = useState<string | null>(null);

  const {
    addImportedGame,
    setLoading,
    setError: setStoreError,
  } = useGameStore();

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

  const extractPgnMetadata = (pgn: string) => {
    const getTagValue = (tag: string) => {
      const regex = new RegExp(`\\[${tag} "([^"]+)"\\]`);
      const match = pgn.match(regex);
      return match ? match[1] : "";
    };

    const moveCount = (pgn.match(/\d+\./g) || []).length;

    return {
      event: getTagValue("Event") || "Unknown Event",
      site: getTagValue("Site") || "Unknown Site",
      date:
        getTagValue("Date").replace(/\./g, "-") ||
        new Date().toISOString().slice(0, 10),
      result:
        getTagValue("Result") === "1-0"
          ? "WIN"
          : getTagValue("Result") === "0-1"
          ? "LOSS"
          : "DRAW",
      white: getTagValue("White") || "Unknown White",
      black: getTagValue("Black") || "Unknown Black",
      timeControl: getTagValue("TimeControl") || "Unknown TC",
      moves: moveCount.toString() || "0",
      opening: "Unknown Opening",
      source: "PGN Upload",
      color: "White",
      gameFormat: "PGN Upload",
      gameType: getTagValue("TimeControl").includes("+")
        ? "standard"
        : "classical",
      rating: "1800",
      eloChange: "(+0 ELO Rating)",
      opponent: "",
    };
  };

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".pgn")) {
      alert("Please upload a PGN file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setFileContent(e.target.result);
      }
    };
    reader.readAsText(file);
    // Don't set isSubmitted here, just show the file
  }, []);

  const handleButtonClick = useCallback(() => {
    if (activeTab === "upload" && !fileName) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else if (
      (activeTab === "paste" && pgnText.trim()) ||
      (activeTab === "upload" && fileName)
    ) {
      // For paste tab, go straight to submitted state
      if (activeTab === "paste") {
        setIsSubmitted(true);
      } else if (activeTab === "upload") {
        // For upload tab, show the upload progress
        setIsUploading(true);
        handleAnalyzeButtonClick();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fileName, pgnText]);

  const handleAnalyzeButtonClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStoreError(null);

    if (!isUploading) {
      setIsUploading(true);
    }

    setUploadProgress(0);

    try {
      const pgnContent = activeTab === "paste" ? pgnText : fileContent;

      const formData = new FormData();

      if (activeTab === "paste") {
        formData.append("pgn", pgnText);
        formData.append("type", "text");
      } else if (activeTab === "upload") {
        formData.append("pgn", fileContent);
        formData.append("fileName", fileName);
        formData.append("fileSize", fileSize.toString());
        formData.append("type", "file");
      }

      const response = await axios.post(
        `${endpoint}/games/import-game`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionId}`,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const metadata = extractPgnMetadata(pgnContent);

      const currentUser = "User";
      metadata.opponent =
        metadata.white === currentUser ? metadata.black : metadata.white;

      metadata.color = metadata.white === currentUser ? "White" : "Black";

      const newGame = addImportedGame({
        ...metadata,
        pgn: pgnContent,
      }) as unknown as Game;

      setImportedGameId(newGame.id);

      // Only set to submitted after upload is complete
      setIsUploading(false);
      setIsSubmitted(true);

      // Only reset dialog after a short delay to show success
      setTimeout(() => {
        resetDialog();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze PGN data";
      setError(errorMessage);
      setStoreError(errorMessage);
      setIsUploading(false);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [
    activeTab,
    fileContent,
    fileName,
    fileSize,
    pgnText,
    resetDialog,
    addImportedGame,
    setLoading,
    setStoreError,
    sessionId,
    isUploading,
  ]);

  const handleRemoveFile = useCallback(() => {
    setFileName("");
    setFileSize(0);
    setFileContent("");
    setError(null);
  }, []);

  return (
    <div>
      <button
        type="button"
        className="flex justify-center items-center lg:gap-2 py-[20px] px-1 rounded-3xl btn-primary w-[140px] h-[36px] lg:w-[200px] lg:h-[48px] font-primary"
        onClick={() => setOpenDialog(true)}
      >
        <Upload className="h-[20px]" />
        <h1 className="text-xs lg:text-sm font-primary">Import Games</h1>
      </button>

      {openDialog && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
            {!isSubmitted && <DialogHeader resetDialog={resetDialog} />}

            <div className="px-6 py-4">
              {isSubmitted ? (
                <SuccessView
                  resetDialog={resetDialog}
                  handleAnalyzeButtonClick={handleAnalyzeButtonClick}
                  isLoading={isLoading}
                  error={error}
                />
              ) : (
                <>
                  <DialogInstructions />

                  <TabSelector
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                  />

                  <div className="mt-5 h-[200px]">
                    {activeTab === "paste" && (
                      <PasteTab pgnText={pgnText} setPgnText={setPgnText} />
                    )}

                    {activeTab === "upload" && !fileName && (
                      <DragDropArea
                        dragActive={dragActive}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        fileInputRef={fileInputRef}
                        handleFileInput={handleFileInput}
                      />
                    )}

                    {activeTab === "upload" && fileName && (
                      <div className="h-full border-2 border-dashed border-blue-base bg-blue-base/5 rounded-lg p-4 flex flex-col justify-center items-center">
                        {isUploading ? (
                          <UploadProgress
                            fileName={fileName}
                            fileSize={fileSize}
                            uploadProgress={uploadProgress}
                          />
                        ) : (
                          <UploadedFile
                            fileName={fileName}
                            fileSize={fileSize}
                            handleRemoveFile={handleRemoveFile}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-2 text-red-500 text-sm">{error}</div>
                  )}

                  {activeTab === "upload" && <FileFormatInfo />}

                  <SubmitButton
                    activeTab={activeTab}
                    pgnText={pgnText}
                    fileName={fileName}
                    isUploading={isUploading}
                    handleButtonClick={handleButtonClick}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogButton;
