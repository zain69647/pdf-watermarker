import JSZip from 'jszip';

interface ProcessedFile {
  filename: string;
  data: Uint8Array;
}

function isAndroidWebView(): boolean {
  const ua = navigator.userAgent || '';
  // Most Android WebView wrappers include "wv" in the UA string.
  return /Android/i.test(ua) && /\bwv\b/i.test(ua);
}

async function tryWebShare(file: File): Promise<boolean> {
  try {
    const navAny = navigator as any;
    if (typeof navAny?.share !== 'function') return false;

    // canShare may not exist in some WebViews
    if (typeof navAny?.canShare === 'function') {
      const can = navAny.canShare({ files: [file] });
      if (!can) return false;
    }

    await navAny.share({ files: [file], title: file.name });
    return true;
  } catch {
    return false;
  }
}

function downloadBlobWithAnchor(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function openBlobInSameTab(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  // Navigate instead of "download" to avoid some WebView download handlers.
  window.location.href = url;
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

/**
 * Downloads a single file.
 *
 * In Android WebView wrappers (like Website2APK Builder), `blob:` downloads are often blocked.
 * We try Web Share first (best no-host workaround). If not available, we open the PDF instead
 * of forcing a download.
 */
export function downloadSingleFile(filename: string, data: Uint8Array): void {
  // Copy into a fresh ArrayBuffer (avoids SharedArrayBuffer typing issues in some builds)
  const bytes = new Uint8Array(data);
  
  // Determine mime type from filename extension
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  let mimeType = 'application/pdf';
  if (ext === 'png') mimeType = 'image/png';
  else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
  else if (ext === 'webp') mimeType = 'image/webp';
  else if (ext === 'gif') mimeType = 'image/gif';
  
  const blob = new Blob([bytes.buffer], { type: mimeType });

  if (isAndroidWebView()) {
    const file = new File([blob], filename, { type: blob.type });
    void (async () => {
      const shared = await tryWebShare(file);
      if (!shared) {
        // Fallback: open the file so the user can use the system viewer/share to save it.
        openBlobInSameTab(blob);
        alert('Your Android WebView wrapper blocks direct downloads. I opened the file instead — use the viewer\'s Share/Save option, or install the site as a PWA for normal downloads.');
      }
    })();
    return;
  }

  downloadBlobWithAnchor(blob, filename);
}

/**
 * Downloads multiple files as a ZIP archive.
 */
export async function downloadAsZip(files: ProcessedFile[]): Promise<void> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.filename, file.data);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const zipName = `watermarked_files_${Date.now()}.zip`;

  if (isAndroidWebView()) {
    const file = new File([zipBlob], zipName, { type: 'application/zip' });
    const shared = await tryWebShare(file);
    if (!shared) {
      openBlobInSameTab(zipBlob);
      alert('Your Android WebView wrapper blocks direct downloads. I opened the ZIP instead — use Share/Save, or install the site as a PWA for normal downloads.');
    }
    return;
  }

  downloadBlobWithAnchor(zipBlob, zipName);
}

/**
 * Smart download - single file directly, multiple as ZIP.
 */
export async function downloadFiles(files: ProcessedFile[]): Promise<void> {
  if (files.length === 0) return;

  if (files.length === 1) {
    downloadSingleFile(files[0].filename, files[0].data);
  } else {
    await downloadAsZip(files);
  }
}
