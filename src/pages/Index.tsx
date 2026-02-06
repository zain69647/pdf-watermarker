import { useState, useCallback, useEffect } from 'react';
import { Droplet, Download, Trash2, AlertTriangle, CheckCircle2, FileCheck } from 'lucide-react';
import DropZone from '@/components/DropZone';
import FileList, { FileItem } from '@/components/FileList';
import { fetchWatermarkImage, processFile } from '@/utils/pdfWatermark';
import { processImageFile, isImageFile, isPdfFile } from '@/utils/imageWatermark';
import { downloadFiles, downloadSingleFile } from '@/utils/downloadHelper';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import AnimatedCounter from '@/components/AnimatedCounter';
import KiteDecorations from '@/components/KiteDecorations';

/**
 * Main PDF & Image Watermarker application
 * Mobile-first design, fully client-side
 */
const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkAvailable, setWatermarkAvailable] = useState<boolean | null>(null);
  const [processedFiles, setProcessedFiles] = useState<{ filename: string; data: Uint8Array }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [watermarkSize, setWatermarkSize] = useState(400);
  const [watermarkOpacity, setWatermarkOpacity] = useState(10);
  const [totalWatermarked, setTotalWatermarked] = useState<number | null>(null);
  // Load global count from database and subscribe to realtime updates
  useEffect(() => {
    // Fetch initial count
    const fetchCount = async () => {
      const { data, error } = await supabase
        .from('global_stats')
        .select('total_watermarked')
        .eq('id', 'main')
        .single();
      
      if (!error && data) {
        setTotalWatermarked(data.total_watermarked);
      }
    };
    
    fetchCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('global-stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'global_stats',
          filter: 'id=eq.main'
        },
        (payload) => {
          setTotalWatermarked(payload.new.total_watermarked);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Check if watermark logo exists on mount
  useEffect(() => {
    fetch('/assets/logo.png', { method: 'HEAD' })
      .then(res => setWatermarkAvailable(res.ok))
      .catch(() => setWatermarkAvailable(false));
  }, []);

  // Handle file selection
  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setError(null);
    
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending' as const,
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...fileItems]);
    setProcessedFiles([]);
  }, []);

  // Remove a file from the list
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setProcessedFiles([]);
  }, []);

  // Clear all files
  const handleClearAll = useCallback(() => {
    setFiles([]);
    setProcessedFiles([]);
    setError(null);
  }, []);

  // Process all PDFs with watermark
  const handleProcess = useCallback(async () => {
    if (files.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    setProcessedFiles([]);
    
    try {
      // Fetch watermark image
      const watermarkBytes = await fetchWatermarkImage();
      
      const results: { filename: string; data: Uint8Array }[] = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        
        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'processing' as const, progress: 0 }
            : f
        ));
        
        try {
          let result: { filename: string; data: Uint8Array };
          
          if (isPdfFile(fileItem.file)) {
            result = await processFile(
              fileItem.file,
              watermarkBytes,
              (progress) => {
                setFiles(prev => prev.map(f =>
                  f.id === fileItem.id ? { ...f, progress } : f
                ));
              },
              watermarkSize,
              watermarkOpacity / 100
            );
          } else if (isImageFile(fileItem.file)) {
            result = await processImageFile(
              fileItem.file,
              watermarkBytes,
              (progress) => {
                setFiles(prev => prev.map(f =>
                  f.id === fileItem.id ? { ...f, progress } : f
                ));
              },
              watermarkSize,
              watermarkOpacity / 100
            );
          } else {
            throw new Error('Unsupported file type');
          }
          
          results.push(result);
          
          // Update status to complete
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id
              ? { ...f, status: 'complete' as const, progress: 100 }
              : f
          ));
        } catch (err) {
          // Update status to error
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id
              ? { 
                  ...f, 
                  status: 'error' as const, 
                  error: err instanceof Error ? err.message : 'Failed to process'
                }
              : f
          ));
        }
      }
      
      setProcessedFiles(results);
      
      // Update global counter in database
      if (results.length > 0) {
        const { data: currentData } = await supabase
          .from('global_stats')
          .select('total_watermarked')
          .eq('id', 'main')
          .single();
        
        if (currentData) {
          await supabase
            .from('global_stats')
            .update({ 
              total_watermarked: currentData.total_watermarked + results.length,
              updated_at: new Date().toISOString()
            })
            .eq('id', 'main');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [files, isProcessing]);

  // Download processed files
  const handleDownload = useCallback(async () => {
    if (processedFiles.length === 0) return;
    
    try {
      await downloadFiles(processedFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  }, [processedFiles]);

  // Download individual file
  const handleDownloadSingle = useCallback((index: number) => {
    const file = processedFiles[index];
    if (file) {
      downloadSingleFile(file.filename, file.data);
    }
  }, [processedFiles]);

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const completeCount = files.filter(f => f.status === 'complete').length;
  const hasErrors = files.some(f => f.status === 'error');

  return (
    <div className="min-h-screen bg-background relative">
      {/* Kite Festival Decorations - behind content */}
      <KiteDecorations />
      
      {/* Global counter banner */}
      <div className="bg-primary/10 backdrop-blur-sm border-b border-primary/20 px-4 py-2 relative z-10">
        <div className="container max-w-lg mx-auto flex items-center justify-center gap-2">
          <FileCheck className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            <AnimatedCounter value={totalWatermarked} className="text-primary font-bold" /> files watermarked globally
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
        <div className="container max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Droplet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Watermarker</h1>
            <p className="text-xs text-muted-foreground">Add watermarks to PDFs & images</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 relative z-10">
        
        {/* Warning if watermark not available */}
        {watermarkAvailable === false && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Watermark logo missing</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please add your logo at /assets/logo.png
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Error</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Drop zone */}
        <DropZone 
          onFilesSelected={handleFilesSelected} 
          disabled={isProcessing || watermarkAvailable === false}
        />

        {/* Watermark settings */}
        <div className="space-y-4 p-4 rounded-xl bg-card/70 backdrop-blur-sm border border-border/50">
          {/* Size control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Watermark Size</label>
              <span className="text-sm text-muted-foreground">{watermarkSize}px</span>
            </div>
            <Slider
              value={[watermarkSize]}
              onValueChange={(values) => setWatermarkSize(values[0])}
              min={50}
              max={500}
              step={10}
              disabled={isProcessing}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (50px)</span>
              <span>Large (500px)</span>
            </div>
          </div>

          {/* Opacity control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Watermark Opacity</label>
              <span className="text-sm text-muted-foreground">{watermarkOpacity}%</span>
            </div>
            <Slider
              value={[watermarkOpacity]}
              onValueChange={(values) => setWatermarkOpacity(values[0])}
              min={5}
              max={100}
              step={5}
              disabled={isProcessing}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtle (5%)</span>
              <span>Solid (100%)</span>
            </div>
          </div>
        </div>

        {/* File list */}
        <FileList 
          files={files} 
          onRemove={handleRemoveFile}
          disabled={isProcessing}
        />

        {/* Action buttons */}
        {files.length > 0 && (
          <div className="space-y-3">
            {/* Process button */}
            {pendingCount > 0 && (
              <button
                onClick={handleProcess}
                disabled={isProcessing || watermarkAvailable === false}
                className="btn-primary w-full"
              >
                <Droplet className="w-5 h-5" />
                {isProcessing ? 'Processing...' : `Apply Watermark to ${pendingCount} file${pendingCount !== 1 ? 's' : ''}`}
              </button>
            )}

            {/* Success message and download */}
            {processedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-foreground">
                    {completeCount} file{completeCount !== 1 ? 's' : ''} processed successfully!
                  </span>
                </div>
                
                <button
                  onClick={handleDownload}
                  className="btn-primary w-full"
                >
                  <Download className="w-5 h-5" />
                  Download {processedFiles.length > 1 ? 'All (ZIP)' : 'File'}
                </button>
                
                {/* Individual download buttons for multiple files */}
                {processedFiles.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground text-center">Or download individually:</p>
                    {processedFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => handleDownloadSingle(index)}
                        className="btn-secondary w-full text-sm py-3"
                      >
                        <Download className="w-4 h-4" />
                        {file.filename}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Clear button */}
            {!isProcessing && (
              <button
                onClick={handleClearAll}
                className="btn-secondary w-full"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            )}

            {/* Error indicator */}
            {hasErrors && (
              <p className="text-xs text-center text-muted-foreground">
                Some files failed to process. You can remove them and try again.
              </p>
            )}
          </div>
        )}


        {/* Info section */}
        <div className="pt-4 border-t border-border">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              ✓ Works offline after loading
            </p>
            <p className="text-xs text-muted-foreground">
              ✓ Files processed locally - nothing uploaded
            </p>
            <p className="text-xs text-muted-foreground">
              ✓ Original quality preserved
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto relative z-10 bg-card/60 backdrop-blur-sm">
        <div className="container max-w-lg mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            No ads • No tracking • No data collection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
