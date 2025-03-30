// DialogButton.tsx
import React, { useState, useRef, useCallback, ChangeEvent } from "react";
import { Upload } from "lucide-react";
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

const DialogButton = () => {
  // State variables
  const [openDialog, setOpenDialog] = useState(false);
  const [pgnText, setPgnText] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileContent, setFileContent] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset all state
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
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement> | any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file input change
  const handleFileInput = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      handleFile(target.files[0]);
    }
  }, []);

  // Handle file selection
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

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setFileContent(e.target.result);
      }
    };
    reader.readAsText(file);

    setIsUploading(true);
    simulateFileUpload();
  }, []);

  // Simulate file upload progress
  const simulateFileUpload = useCallback(() => {
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
  }, []);

  // Handle import button click
  const handleButtonClick = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fileName, isUploading, pgnText]);

  // Handle analyze button click
  const handleAnalyzeButtonClick = useCallback(() => {
    // Prepare form data
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

    // Log form data to console
    console.log("Submitting PGN data:");
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    // In a real implementation, you would send this data to your analysis endpoint
    resetDialog();
  }, [activeTab, fileContent, fileName, fileSize, pgnText, resetDialog]);

  // Handle removing a file
  const handleRemoveFile = useCallback(() => {
    setFileName("");
    setFileSize(0);
    setFileContent("");
  }, []);

  // Assign the fileInputRef.current.onchange handler
  if (fileInputRef.current) {
    fileInputRef.current.onchange = handleFileInput;
  }

  return (
    <div>
      {/* Button to open dialog */}
      <button
        className="flex justify-center items-center lg:gap-2 py-[20px] px-1 rounded-3xl btn-primary w-[140px] h-[36px] lg:w-[200px] lg:h-[48px] font-primary"
        onClick={() => setOpenDialog(true)}
      >
        <Upload className="h-[20px]" />
        <h1 className="text-xs lg:text-sm font-primary">Import Games</h1>
      </button>

      {/* Dialog overlay */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
            {/* Dialog header */}
            {!isSubmitted && <DialogHeader resetDialog={resetDialog} />}

            {/* Dialog content */}
            <div className="px-6 py-4">
              {isSubmitted ? (
                <SuccessView
                  resetDialog={resetDialog}
                  handleAnalyzeButtonClick={handleAnalyzeButtonClick}
                />
              ) : (
                <>
                  <DialogInstructions />

                  {/* Tab selector */}
                  <TabSelector
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                  />

                  {/* Content area */}
                  <div className="mt-5 h-[200px]">
                    {/* Paste tab */}
                    {activeTab === "paste" && (
                      <PasteTab pgnText={pgnText} setPgnText={setPgnText} />
                    )}

                    {/* Upload tab - empty state */}
                    {activeTab === "upload" && !fileName && (
                      <DragDropArea
                        dragActive={dragActive}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        fileInputRef={fileInputRef}
                      />
                    )}

                    {/* Upload tab - file selected state */}
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

                  {/* File format info */}
                  {activeTab === "upload" && <FileFormatInfo />}

                  {/* Submit button */}
                  <SubmitButton
                    activeTab={activeTab}
                    pgnText={pgnText}
                    fileName={fileName}
                    isUploading={isUploading}
                    handleButtonClick={handleButtonClick}
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
