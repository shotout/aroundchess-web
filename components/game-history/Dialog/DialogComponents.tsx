// DialogComponents.tsx
import React, { ChangeEvent, DragEvent, RefObject } from "react";
import { FileText, Trash, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// TypeScript interfaces for component props - updated with new props
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

interface TabSelectorProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

interface PasteTabProps {
  pgnText: string;
  setPgnText: (text: string) => void;
}

interface DragDropAreaProps {
  dragActive: boolean;
  handleDrag: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void; // Added this prop
}

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  uploadProgress: number;
}

interface UploadedFileProps {
  fileName: string;
  fileSize: number;
  handleRemoveFile: () => void;
}

interface DialogHeaderProps {
  resetDialog: () => void;
}

interface SubmitButtonProps {
  activeTab: string;
  pgnText: string;
  fileName: string;
  isUploading: boolean;
  handleButtonClick: () => void;
  isLoading?: boolean; // Added this prop
}

export const SuccessView: React.FC<SuccessViewProps> = ({
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

// Component for the tab selector
export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  handleTabChange,
}) => {
  return (
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
  );
};

// Component for the "Paste PGN" tab
export const PasteTab: React.FC<PasteTabProps> = ({ pgnText, setPgnText }) => {
  return (
    <div className="h-full border-2 border-dashed border-gray-100 rounded-lg bg-gray-50 p-2">
      <textarea
        className="w-full h-full bg-transparent p-2 resize-none outline-none text-gray-700 placeholder-gray-400"
        placeholder="Paste your PGN here..."
        value={pgnText}
        onChange={(e) => setPgnText(e.target.value)}
      />
    </div>
  );
};

// Component for the drag and drop area - FIXED
export const DragDropArea: React.FC<DragDropAreaProps> = ({
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileInput, // Using the passed handler directly
}) => {
  return (
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
        onChange={handleFileInput} // FIXED: Using the passed handler directly
      />
      <div className="text-center flex flex-col items-center justify-center">
        <Image
          width={64}
          height={64}
          alt=""
          src={"/my-game-history/upload.png"}
        />
        <p className="text-gray-700 mb-1">
          <span className="underline">Drag & drop or click</span>
        </p>
        <p className="text-gray-700">
          to{" "}
          <span
            className="text-blue-base font-medium cursor-pointer underline"
            onClick={() => fileInputRef.current?.click()} // This triggers the file input directly
          >
            select
          </span>{" "}
          a file
        </p>
      </div>
    </div>
  );
};

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  fileSize,
  uploadProgress,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="flex w-full h-auto items-center bg-primary-white border shadow-md p-4 rounded-md">
        <div className="flex items-center flex-1">
          <div className="bg-blue-100 rounded-md p-3 mr-3">
            <h1 className="text-blue-500 font-bold text-lg">PGN</h1>
          </div>
          <div className="flex flex-col">
            <div className="text-gray-800">{fileName}</div>
            <div className="text-gray-500 text-sm">
              {(fileSize / 1024).toFixed(1)} KB
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 100 100">
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
                strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
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
          <div className="text-xs text-center mt-1">uploading file...</div>
        </div>
      </div>
    </div>
  );
};

// Component for showing uploaded file
export const UploadedFile: React.FC<UploadedFileProps> = ({
  fileName,
  fileSize,
  handleRemoveFile,
}) => {
  return (
    <div className="flex items-center w-full">
      <div className="bg-blue-100 rounded-md p-4 mr-3">
        <div className="text-blue-500 font-bold text-lg">PGN</div>
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
  );
};

// Component for the dialog header
export const DialogHeader: React.FC<DialogHeaderProps> = ({ resetDialog }) => {
  return (
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
  );
};

// Component for dialog instructions
export const DialogInstructions: React.FC = () => {
  return (
    <p className="text-sm text-center max-w-2xl mx-auto text-gray-700 mb-6">
      Upload your previous Game's <span className="font-bold">PGN</span> for a
      detailed analysis. You can either paste your{" "}
      <span className="font-bold">PGN</span> directly or upload a{" "}
      <span className="font-bold">PGN</span> file.
    </p>
  );
};

// Component for file format information
export const FileFormatInfo: React.FC = () => {
  return (
    <div className="flex justify-between mt-2 text-sm">
      <span>
        Supported Format: <span className="font-bold">PGN</span>
      </span>
      <span>
        Max Size: <span className="font-bold">5MB</span>
      </span>
    </div>
  );
};

// Component for submit button - updated with isLoading
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  activeTab,
  pgnText,
  fileName,
  isUploading,
  handleButtonClick,
  isLoading,
}) => {
  return (
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
  );
};
