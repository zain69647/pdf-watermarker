import { FileText, X, Check, Loader2, AlertCircle } from 'lucide-react';

export interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  disabled?: boolean;
}

/**
 * Displays list of uploaded PDF files with status
 */
const FileList = ({ files, onRemove, disabled = false }: FileListProps) => {
  if (files.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'complete':
        return <Check className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (item: FileItem) => {
    switch (item.status) {
      case 'processing':
        return <span className="badge-warning">Processing...</span>;
      case 'complete':
        return <span className="badge-success">Complete</span>;
      case 'error':
        return <span className="badge-error">Error</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {files.length} file{files.length !== 1 ? 's' : ''} selected
      </h3>
      
      <div className="space-y-2">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="file-item animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {getStatusIcon(item.status)}
            </div>
            
            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </span>
                {getStatusBadge(item)}
              </div>
              
              {/* Progress bar for processing */}
              {item.status === 'processing' && (
                <div className="progress-bar mt-2">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              
              {/* Error message */}
              {item.status === 'error' && item.error && (
                <p className="text-xs text-destructive mt-1">
                  {item.error}
                </p>
              )}
            </div>
            
            {/* Remove button */}
            {item.status !== 'processing' && !disabled && (
              <button
                onClick={() => onRemove(item.id)}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
