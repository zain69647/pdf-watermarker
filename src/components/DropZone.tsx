import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Image } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  acceptImages?: boolean;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ACCEPTED_PDF_TYPE = 'application/pdf';

/**
 * Drop zone component for PDF and image file upload
 * Supports drag & drop and file picker
 */
const DropZone = ({ onFilesSelected, disabled = false, acceptImages = true }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidFile = useCallback((file: File) => {
    if (file.type === ACCEPTED_PDF_TYPE) return true;
    if (acceptImages && ACCEPTED_IMAGE_TYPES.includes(file.type)) return true;
    return false;
  }, [acceptImages]);

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
    const validFiles = droppedFiles.filter(isValidFile);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [disabled, onFilesSelected, isValidFile]);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(isValidFile);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const acceptString = acceptImages 
    ? `${ACCEPTED_PDF_TYPE},${ACCEPTED_IMAGE_TYPES.join(',')}`
    : ACCEPTED_PDF_TYPE;

  return (
    <div
      className={`drop-zone min-h-[200px] p-8 ${isDragging ? 'dragging' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload PDF or image files"
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
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
            <div className="flex items-center gap-1">
              <Upload className="w-6 h-6 text-primary" />
              {acceptImages && <Image className="w-5 h-5 text-primary" />}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? 'Drop files here' : 'Upload files'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop or tap to select
          </p>
        </div>
        
        <span className="text-xs text-muted-foreground">
          {acceptImages ? 'Supports PDFs and images (JPG, PNG, WebP, GIF)' : 'Supports multiple PDFs'}
        </span>
      </div>
    </div>
  );
};

export default DropZone;
