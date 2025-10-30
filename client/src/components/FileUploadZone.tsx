import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  currentFile?: File | null;
}

export default function FileUploadZone({ onFileSelect, accept = ".yaml,.yml", currentFile }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {currentFile ? (
        <div className="flex items-center gap-3 p-4 bg-accent rounded-md border border-accent-border" data-testid="file-selected">
          <FileText className="w-5 h-5 text-primary" />
          <span className="flex-1 text-sm font-medium text-foreground">{currentFile.name}</span>
          <button
            onClick={handleRemove}
            className="p-1 hover-elevate active-elevate-2 rounded-md"
            data-testid="button-remove-file"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-all hover-elevate active-elevate-2",
            isDragging ? "border-primary bg-accent" : "border-border bg-background"
          )}
          data-testid="dropzone-upload"
        >
          <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground mb-1">
            Drop Swagger YAML file or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Accepts .yaml and .yml files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-file"
          />
        </div>
      )}
    </div>
  );
}
