import React, { useState, useRef } from "react";
import { CheckCircle, FileText, Trash, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

const DialogButton: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [pgnText, setPgnText] = useState("");
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: "paste" | "upload"): void => {
    setActiveTab(tab);
    setPgnText("");
    setFileName("");
    setFileSize(0);
    setIsSubmitted(false);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File): void => {
    // Check file type (simple check for .pgn extension)
    if (!file.name.toLowerCase().endsWith(".pgn")) {
      alert("Please upload a PGN file.");
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
  };

  const handleButtonClick = () => {
    if (activeTab === "upload" && !fileName && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Handle import logic
      setIsSubmitted(true);
    }
  };

  const resetDialog = () => {
    setIsSubmitted(false);
    setOpenDialog(false);
    setPgnText("");
    setFileName("");
    setFileSize(0);
    setActiveTab("paste");
  };

  return (
    <div>
      {/* Dialog Trigger Button */}
      <button
        className="flex justify-center items-center lg:gap-2 py-[20px] px-1 rounded-3xl btn-primary w-[140px] h-[36px] lg:w-[200px] lg:h-[48px] font-primary"
        onClick={() => setOpenDialog(true)}
      >
        <Upload className="h-[20px]" />
        <h1 className="text-xs lg:text-sm font-primary">Import Games</h1>
      </button>

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
              <div className="w-6"></div>
              <h2 className="text-xl font-semibold text-center flex-1">
                {isSubmitted ? "Game Imported" : "Import a Game"}
              </h2>
              <button
                onClick={resetDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {isSubmitted ? (
                <div className="flex flex-col items-center py-6">
                  {/* Chess Piece Icon with Success Checkmark */}
                  <div className="relative mb-6">
                    <div className="w-36 h-36 bg-blue-100/50 rounded-full flex items-center justify-center">
                      <div className="text-cyan-400">
                        {/* Simple SVG representation of a chess piece (pawn) */}
                        <svg
                          width="120"
                          height="120"
                          viewBox="0 0 120 120"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M45 95H75L80 110H40L45 95Z"
                            fill="currentColor"
                          />
                          <path
                            d="M35 105H85L90 115H30L35 105Z"
                            fill="currentColor"
                          />
                          <path
                            d="M60 25C68.2843 25 75 31.7157 75 40C75 46.5 70 50 65 55C60 60 60 75 60 75C60 75 60 60 55 55C50 50 45 46.5 45 40C45 31.7157 51.7157 25 60 25Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>

                      {/* Blue checkmark circle */}
                      <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>

                      {/* Small decorative sparkles */}
                      <div className="absolute top-5 right-10 text-cyan-400">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" />
                        </svg>
                      </div>
                      <div className="absolute top-10 left-5 text-cyan-400">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 8 8"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3L4 0Z" />
                        </svg>
                      </div>
                      <div className="absolute right-12 bottom-12 text-cyan-400">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 0L6.25 3.75L10 5L6.25 6.25L5 10L3.75 6.25L0 5L3.75 3.75L5 0Z" />
                        </svg>
                      </div>
                      <div className="absolute top-4 right-4 text-blue-500">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9 0L11 7L18 9L11 11L9 18L7 11L0 9L7 7L9 0Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    Your Import was successful!
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Your PGN was successfully uploaded. You can now analyze your
                    Game with our Advanced Chess Engine!
                  </p>

                  {/* File info card */}
                  <div className="w-full bg-[#C6EEFE] rounded-lg border shadow-sm mb-6">
                    <div className="flex items-center p-4">
                      <div className="bg-blue-100 rounded-md p-4 mr-3">
                        <div className="text-blue-500 font-bold text-lg">
                          PGN
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-800">
                          {fileName || "chess_games.pgn"}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {fileSize
                            ? `${(fileSize / 1024).toFixed(1)} KB`
                            : "5MB"}
                        </div>
                      </div>
                      <Button className="text-red-500 bg-red-100 border border-red-600 flex items-center py-5 rounded-3xl">
                        <Trash />
                        <h1 className="ml-1">Delete File</h1>
                      </Button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex w-full gap-3">
                    <button
                      className="flex-1 py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-full"
                      onClick={resetDialog}
                    >
                      Back to Game History
                    </button>
                    <button
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
                      onClick={resetDialog}
                    >
                      Analyze Game
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-center max-w-2xl mx-auto text-gray-700 mb-6">
                    Upload your previous Game's{" "}
                    <span className="font-medium">PGN</span> for a detailed
                    analysis. You can either paste your{" "}
                    <span className="font-medium">PGN</span> directly or upload
                    a <span className="font-medium">PGN</span> file.
                  </p>

                  {/* Toggle buttons */}
                  <Card className="flex gap-3 mt-5 bg-gray-50 p-1">
                    <button
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-sm ${
                        activeTab === "paste"
                          ? "bg-white border shadow-sm border-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTabChange("paste")}
                    >
                      <FileText className="h-4 w-4" />
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

                  {/* Conditional content based on active tab */}
                  {activeTab === "paste" ? (
                    <div className="mt-5 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50 p-8">
                      <textarea
                        className="w-full lg:h-48 bg-transparent p-2 resize-none outline-none text-gray-700 placeholder-gray-400"
                        placeholder="Paste your PGN here..."
                        value={pgnText}
                        onChange={(e) => setPgnText(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div
                      className={`mt-5 border-2 border-dashed ${
                        dragActive
                          ? "border-blue-400 bg-blue-100"
                          : "border-blue-100 bg-blue-50"
                      } rounded-lg p-8 flex flex-col items-center justify-center`}
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

                      {fileName ? (
                        <div className="text-center lg:h-48 flex flex-col items-center justify-center">
                          <FileText className="h-16 w-16 mx-auto text-blue-600 mb-2" />
                          <p className="text-gray-800 font-medium mb-1">
                            {fileName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {(fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center lg:h-48 flex flex-col items-center justify-center">
                          <Upload className="h-16 w-16 mx-auto text-blue-600 mb-2" />
                          <p className="text-gray-700 mb-1">
                            <span className="underline">
                              Drag & drop or click
                            </span>
                          </p>
                          <p className="text-gray-700">
                            to{" "}
                            <span
                              className="text-blue-600 font-medium cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              select
                            </span>{" "}
                            a file
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Format info outside the div */}
                  {activeTab === "upload" && (
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>
                        Supported Format:{" "}
                        <span className="font-medium">PGN</span>
                      </span>
                      <span>
                        Max Size: <span className="font-medium">5MB</span>
                      </span>
                    </div>
                  )}

                  {/* Import button */}
                  <button
                    className={`w-full mt-5 py-4 ${
                      (activeTab === "paste" && pgnText.trim()) ||
                      (activeTab === "upload" && fileName)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 opacity-80"
                    } text-white rounded-3xl flex items-center justify-center`}
                    onClick={handleButtonClick}
                  >
                    {activeTab === "upload" && !fileName
                      ? "Select File"
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

export default DialogButton;
