import { createWorker } from 'tesseract.js';
import sharp from 'sharp';

/**
 * OCR utility to extract Arabic text from images using Tesseract.js
 * Used as a free fallback when AI vision APIs hit quota limits.
 * Pre-processes the image with Sharp for better OCR accuracy.
 */
export async function extractTextWithOCR(imageBuffer: Buffer): Promise<string> {
  // Pre-process for OCR: grayscale and high contrast helps Tesseract
  const processedImage = await sharp(imageBuffer)
    .grayscale()
    .normalize() // Enhances contrast
    .threshold(180) // Makes it binary (black/white) for sharper text
    .toBuffer();

  const worker = await createWorker('ara'); // Standard initialization for v5+
  
  try {
    // In v5+, createWorker('ara') handles load + initialize if used with defaults
    const { data: { text } } = await worker.recognize(processedImage);
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text using OCR');
  } finally {
    await worker.terminate();
  }
}
