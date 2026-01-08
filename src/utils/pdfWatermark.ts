import { PDFDocument } from 'pdf-lib';

/**
 * Fetches the watermark logo image
 * @returns ArrayBuffer of the logo image
 */
export async function fetchWatermarkImage(): Promise<ArrayBuffer> {
  const response = await fetch('/assets/logo.png');
  
  if (!response.ok) {
    throw new Error('Watermark logo not found. Please ensure /assets/logo.png exists.');
  }
  
  return response.arrayBuffer();
}

/**
 * Applies a centered watermark to all pages of a PDF
 * @param pdfBytes - Original PDF file as ArrayBuffer
 * @param watermarkBytes - Watermark image as ArrayBuffer
 * @param opacity - Opacity of watermark (0-1, default 0.1 = 10%)
 * @param watermarkMaxSize - Maximum size of watermark in pixels (default 200)
 * @returns Modified PDF as Uint8Array
 */
export async function applyWatermark(
  pdfBytes: ArrayBuffer,
  watermarkBytes: ArrayBuffer,
  opacity: number = 0.1,
  watermarkMaxSize: number = 200
): Promise<Uint8Array> {
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  // Embed the watermark image (supports PNG and JPG)
  let watermarkImage;
  try {
    watermarkImage = await pdfDoc.embedPng(watermarkBytes);
  } catch {
    // If PNG fails, try JPG
    watermarkImage = await pdfDoc.embedJpg(watermarkBytes);
  }
  
  // Get all pages
  const pages = pdfDoc.getPages();
  
  // Calculate scaled dimensions maintaining aspect ratio
  const imgWidth = watermarkImage.width;
  const imgHeight = watermarkImage.height;
  const aspectRatio = imgWidth / imgHeight;
  
  let scaledWidth: number;
  let scaledHeight: number;
  
  if (aspectRatio > 1) {
    scaledWidth = watermarkMaxSize;
    scaledHeight = watermarkMaxSize / aspectRatio;
  } else {
    scaledHeight = watermarkMaxSize;
    scaledWidth = watermarkMaxSize * aspectRatio;
  }
  
  // Apply watermark to each page
  for (const page of pages) {
    const { width, height } = page.getSize();
    
    // Calculate center position
    const x = (width - scaledWidth) / 2;
    const y = (height - scaledHeight) / 2;
    
    // Draw watermark image with opacity
    page.drawImage(watermarkImage, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
      opacity,
    });
  }
  
  // Save and return the modified PDF
  return pdfDoc.save();
}

/**
 * Processes a single PDF file and returns the watermarked version
 * @param file - PDF File object
 * @param watermarkBytes - Watermark image as ArrayBuffer
 * @param onProgress - Progress callback (0-100)
 * @param watermarkSize - Maximum size of the watermark in pixels (default 200)
 * @returns Object with filename and watermarked PDF bytes
 */
export async function processFile(
  file: File,
  watermarkBytes: ArrayBuffer,
  onProgress?: (progress: number) => void,
  watermarkSize: number = 200
): Promise<{ filename: string; data: Uint8Array }> {
  onProgress?.(10);
  
  // Read file as ArrayBuffer
  const pdfBytes = await file.arrayBuffer();
  onProgress?.(30);
  
  // Apply watermark with custom size
  const watermarkedPdf = await applyWatermark(pdfBytes, watermarkBytes, 0.1, watermarkSize);
  onProgress?.(90);
  
  // Generate output filename
  const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
  const outputFilename = `${nameWithoutExt}_watermarked.pdf`;
  
  onProgress?.(100);
  
  return {
    filename: outputFilename,
    data: watermarkedPdf,
  };
}
