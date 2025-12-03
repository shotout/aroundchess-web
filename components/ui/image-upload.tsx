"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState(value)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setPreview(base64String)
          onChange(base64String)
        }
        reader.readAsDataURL(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  })

  const handleRemove = () => {
    setPreview("")
    onChange("")
  }

  return (
    <div className={className}>
      {preview ? (
        <div className="relative h-40 w-40">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
        >
          <input {...getInputProps()} />
          <ImagePlus className="mb-2 h-6 w-6 text-gray-400" />
          <p className="text-center text-[14px] --sm text-gray-600">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop or click to upload"}
          </p>
        </div>
      )}
    </div>
  )
} 