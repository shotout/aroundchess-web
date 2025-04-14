import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimplePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const SimplePopup: React.FC<SimplePopupProps> = ({
  isOpen,
  onClose,
  title = "Enter Chess.com Username",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., MagnusCarlsen"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onClose}>Load Games</Button>
        </div>
      </div>
    </div>
  );
};

export default SimplePopup;
