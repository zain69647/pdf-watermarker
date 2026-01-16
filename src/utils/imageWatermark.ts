/**
 * Applies a centered watermark to an image
 * @param imageFile - Original image File object
 * @param watermarkBytes - Watermark image as ArrayBuffer
 * @param opacity - Opacity of watermark (0-1, default 0.1 = 10%)
 * @param watermarkMaxSize - Maximum size of watermark in pixels (default 200)
 * @returns Modified image as Uint8Array
 */
export async function applyImageWatermark(
  imageFile: File,
  watermarkBytes: ArrayBuffer,
  opacity: number = 0.1,
  watermarkMaxSize: number = 200
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    // Load main image
    const mainImg = new Image();
    const mainBlob = new Blob([imageFile], { type: imageFile.type });
    const mainUrl = URL.createObjectURL(mainBlob);

    mainImg.onload = () => {
      // Load watermark image
      const watermarkImg = new Image();
      const watermarkBlob = new Blob([watermarkBytes], { type: 'image/png' });
      const watermarkUrl = URL.createObjectURL(watermarkBlob);

      watermarkImg.onload = () => {
        // Create canvas with original image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = mainImg.width;
        canvas.height = mainImg.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw original image
        ctx.drawImage(mainImg, 0, 0);

        // Calculate watermark dimensions maintaining aspect ratio
        const aspectRatio = watermarkImg.width / watermarkImg.height;
        let scaledWidth: number;
        let scaledHeight: number;

        if (aspectRatio > 1) {
          scaledWidth = Math.min(watermarkMaxSize, mainImg.width * 0.8);
          scaledHeight = scaledWidth / aspectRatio;
        } else {
          scaledHeight = Math.min(watermarkMaxSize, mainImg.height * 0.8);
          scaledWidth = scaledHeight * aspectRatio;
        }

        // Center position
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        // Apply opacity and draw watermark
        ctx.globalAlpha = opacity;
        ctx.drawImage(watermarkImg, x, y, scaledWidth, scaledHeight);
        ctx.globalAlpha = 1;

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob'));
              return;
            }

            blob.arrayBuffer().then((buffer) => {
              resolve(new Uint8Array(buffer));
            });

            // Cleanup
            URL.revokeObjectURL(mainUrl);
            URL.revokeObjectURL(watermarkUrl);
          },
          imageFile.type || 'image/png',
          0.95
        );
      };

      watermarkImg.onerror = () => {
        URL.revokeObjectURL(watermarkUrl);
        reject(new Error('Failed to load watermark image'));
      };

      watermarkImg.src = watermarkUrl;
    };

    mainImg.onerror = () => {
      URL.revokeObjectURL(mainUrl);
      reject(new Error('Failed to load image file'));
    };

    mainImg.src = mainUrl;
  });
}

/**
 * Processes a single image file and returns the watermarked version
 * @param file - Image File object
 * @param watermarkBytes - Watermark image as ArrayBuffer
 * @param onProgress - Progress callback (0-100)
 * @param watermarkSize - Maximum size of the watermark in pixels
 * @param watermarkOpacity - Opacity of the watermark (0-1)
 * @returns Object with filename and watermarked image bytes
 */
export async function processImageFile(
  file: File,
  watermarkBytes: ArrayBuffer,
  onProgress?: (progress: number) => void,
  watermarkSize: number = 200,
  watermarkOpacity: number = 0.1
): Promise<{ filename: string; data: Uint8Array }> {
  onProgress?.(10);

  // Apply watermark
  const watermarkedImage = await applyImageWatermark(
    file,
    watermarkBytes,
    watermarkOpacity,
    watermarkSize
  );
  onProgress?.(90);

  // Generate output filename
  const ext = file.name.split('.').pop() || 'png';
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
  const outputFilename = `${nameWithoutExt}_watermarked.${ext}`;

  onProgress?.(100);

  return {
    filename: outputFilename,
    data: watermarkedImage,
  };
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if a file is a PDF
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}
