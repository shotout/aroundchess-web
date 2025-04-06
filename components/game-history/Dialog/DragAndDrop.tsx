// DragDropArea.tsx
import React from "react";
import { Upload } from "lucide-react";

interface DragDropAreaProps {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectFileClick: () => void; // For clicking the "select file" text
}

const DragDropArea: React.FC<DragDropAreaProps> = ({
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileInput,
  onSelectFileClick,
}) => {
  return (
    <div
      className={`h-full border-2 border-dashed ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-blue-base bg-blue-base/5"
      } rounded-lg p-4 flex flex-col justify-center items-center`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="h-10 w-10 text-blue-base mb-2" />
      <p className="text-center text-gray-600 mb-1">
        Drag & drop your PGN file here or{" "}
        <button
          type="button"
          className="text-blue-base font-medium hover:underline focus:outline-none"
          onClick={onSelectFileClick} // This triggers the hidden file input
        >
          select file
        </button>
      </p>
      <p className="text-xs text-gray-500">Maximum file size: 5MB</p>

      {/* Hidden file input - this is properly referenced now */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pgn"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
};

export default DragDropArea;
