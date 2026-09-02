import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileType, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImportDropzoneProps {
  onAnalyze: (pgn: string) => Promise<void>
}

export function ImportDropzone({ onAnalyze }: ImportDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onload = async () => {
      const pgn = reader.result as string
      await onAnalyze(pgn)
    }

    reader.readAsText(file)
  }, [onAnalyze])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "application/x-chess-pgn": [".pgn"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center
          min-h-[300px] cursor-pointer
          transition-colors duration-200
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg text-center text-muted-foreground">Drop your PGN file here...</p>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">
              Drag & drop your PGN file here, or click to select
            </p>
            <p className="text-[14px] --sm text-muted-foreground">
              Maximum file size: 5MB
            </p>
          </div>
        )}
      </div>

      {acceptedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <FileType className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] --sm font-medium truncate">{acceptedFiles[0].name}</p>
              <p className="text-[14px] --xs text-muted-foreground">
                {(acceptedFiles[0].size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button 
            className="w-full gap-2"
            onClick={async () => {
              const file = acceptedFiles[0]
              const reader = new FileReader()
              reader.onload = async () => {
                const pgn = reader.result as string
                await onAnalyze(pgn)
              }
              reader.readAsText(file)
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Analyze Games
          </Button>
        </div>
      )}
    </div>
  )
} 