import FileUploadZone from '../FileUploadZone';
import { useState } from 'react';

export default function FileUploadZoneExample() {
  const [file, setFile] = useState<File | null>(null);
  
  return (
    <div className="p-8">
      <FileUploadZone onFileSelect={setFile} currentFile={file} />
    </div>
  );
}
