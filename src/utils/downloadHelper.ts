import JSZip from 'jszip';

interface ProcessedFile {
  filename: string;
  data: Uint8Array;
}

/**
 * Converts Uint8Array to base64 string
 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Downloads a single file using data URL (WebView compatible)
 */
export function downloadSingleFile(filename: string, data: Uint8Array): void {
  // Convert to base64 data URL for WebView compatibility
  const base64 = uint8ArrayToBase64(data);
  const dataUrl = `data:application/pdf;base64,${base64}`;
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  
  // Generate the ZIP file as base64
  const zipBase64 = await zip.generateAsync({ 
    type: 'base64',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  // Download using data URL for WebView compatibility
  const dataUrl = `data:application/zip;base64,${zipBase64}`;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `watermarked_pdfs_${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
