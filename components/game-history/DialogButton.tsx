import React, { useState, useRef } from "react";
import { Cat, CheckCircle, FileText, Trash, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import DotSpinner from "./Spinner";

const DialogButton = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [pgnText, setPgnText] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
    setPgnText("");
    setFileName("");
    setFileSize(0);
    setIsSubmitted(false);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDrag = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    type: string;
  }) => {
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

  const handleFile = (file: { name: string; size: number }) => {
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

    setIsUploading(true);
    simulateFileUpload();
  };

  const simulateFileUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setIsSubmitted(true);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleButtonClick = () => {
    if (activeTab === "upload" && !fileName && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (
      (activeTab === "paste" && pgnText.trim()) ||
      (activeTab === "upload" && fileName)
    ) {
      if (activeTab === "paste") {
        setIsSubmitted(true);
      } else if (activeTab === "upload" && !isUploading) {
        simulateFileUpload();
      }
    }
  };

  const resetDialog = () => {
    setIsSubmitted(false);
    setOpenDialog(false);
    setPgnText("");
    setFileName("");
    setFileSize(0);
    setActiveTab("paste");
    setIsUploading(false);
    setUploadProgress(0);
  };

  return (
    <div>
      <button
        className="flex justify-center items-center lg:gap-2 py-[20px] px-1 rounded-3xl btn-primary w-[140px] h-[36px] lg:w-[200px] lg:h-[48px] font-primary"
        onClick={() => setOpenDialog(true)}
      >
        <Upload className="h-[20px]" />
        <h1 className="text-xs lg:text-sm font-primary">Import Games</h1>
      </button>

      {openDialog && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
            <div
              style={isSubmitted ? { display: "none" } : { display: "flex" }}
              className="flex justify-between items-center p-4"
            >
              <div className="w-6"></div>
              <h2 className="text-xl font-semibold text-center flex-1">
                Import a Game
              </h2>
              <button
                onClick={resetDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              {isSubmitted ? (
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
                    Your Import was successful!
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Your PGN was successfully uploaded. You can now analyze your
                    Game with our Advanced Chess Engine!
                  </p>

                  <div className="flex w-full gap-3">
                    <button
                      className="flex-1 py-3 btn-secondary font-medium rounded-full"
                      onClick={resetDialog}
                    >
                      Back to Game History
                    </button>
                    <button
                      className="flex-1 py-3 btn-primary text-white font-medium rounded-full"
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
                    <span className="font-bold">PGN</span> for a detailed
                    analysis. You can either paste your{" "}
                    <span className="font-bold">PGN</span> directly or upload a{" "}
                    <span className="font-bold">PGN</span> file.
                  </p>

                  <Card className="flex gap-3 mt-5 bg-[#F9FAFC] border-2 border-gray-100 p-1">
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
                            : "border-blue-base bg-blue-base/10"
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
                          <div className="flex w-full h-auto justify-between items-center bg-primary-white border shadow-md p-2">
                            <div className="bg-blue-100 rounded-md p-4 mb-3">
                              <div className="text-blue-500 font-bold text-lg">
                                PGN
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="text-gray-800 mb-1">
                                {fileName}
                              </div>
                              <div className="text-gray-500 text-sm mb-4">
                                {(fileSize / 1024).toFixed(1)} KB
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
                                <div className="text-[10px] text-nowrap mt-2">
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
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                setFileName("");
                                setFileSize(0);
                              }}
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

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

                  <button
                    className={`w-full mt-5 py-4 rounded-3xl flex items-center justify-center ${
                      (activeTab === "paste" && pgnText.trim()) ||
                      (activeTab === "upload" && fileName && !isUploading)
                        ? "btn-primary text-white"
                        : isUploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "btn-primary text-white"
                    }`}
                    onClick={handleButtonClick}
                    disabled={isUploading}
                  >
                    {activeTab === "upload" && !fileName
                      ? "Select File"
                      : isUploading
                      ? "Uploading..."
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
