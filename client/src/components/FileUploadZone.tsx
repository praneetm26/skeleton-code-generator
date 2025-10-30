import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
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
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-md border-2 border-primary" data-testid="file-selected">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{currentFile.name}</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Swagger specification uploaded</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover-elevate active-elevate-2 rounded-md bg-destructive/10"
            data-testid="button-remove-file"
          >
            <X className="w-4 h-4 text-destructive" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition-all hover-elevate active-elevate-2 relative overflow-hidden",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-background"
          )}
          data-testid="dropzone-upload"
        >
          <div className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all",
            isDragging ? "bg-primary scale-110" : "bg-accent"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? "text-primary-foreground" : "text-primary"
            )} />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {isDragging ? "Drop your file here" : "Drop Swagger YAML file or click to browse"}
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
