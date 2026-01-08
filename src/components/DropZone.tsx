import { useState, useCallback, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

/**
 * Drop zone component for PDF file upload
 * Supports drag & drop and file picker
 */
const DropZone = ({ onFilesSelected, disabled = false }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      onFilesSelected(pdfFiles);
    }
  }, [disabled, onFilesSelected]);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      onFilesSelected(pdfFiles);
    }
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div
      className={`drop-zone min-h-[200px] p-8 ${isDragging ? 'dragging' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload PDF files"
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          {isDragging ? (
            <FileText className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? 'Drop PDF files here' : 'Upload PDF files'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop or tap to select
          </p>
        </div>
        
        <span className="text-xs text-muted-foreground">
          Supports multiple PDFs
        </span>
      </div>
    </div>
  );
};

export default DropZone;
