import JSZip from 'jszip';

interface ProcessedFile {
  filename: string;
  data: Uint8Array;
}

/**
 * Downloads a single file
 */
export function downloadSingleFile(filename: string, data: Uint8Array): void {
  const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Downloads multiple files as a ZIP archive
 */
export async function downloadAsZip(files: ProcessedFile[]): Promise<void> {
  const zip = new JSZip();
  
  // Add each file to the ZIP
  for (const file of files) {
    zip.file(file.filename, file.data);
  }
  
  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  // Download the ZIP
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `watermarked_pdfs_${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Smart download - single file directly, multiple as ZIP
 */
export async function downloadFiles(files: ProcessedFile[]): Promise<void> {
  if (files.length === 0) return;
  
  if (files.length === 1) {
    downloadSingleFile(files[0].filename, files[0].data);
  } else {
    await downloadAsZip(files);
  }
}
