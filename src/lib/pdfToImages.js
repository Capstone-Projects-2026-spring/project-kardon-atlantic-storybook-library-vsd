import * as pdfjsLib from "pdfjs-dist";

// Serve the worker from public/ as a plain static file.
// This avoids Vite module-worker issues in both dev and production.
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MAX_PDF_SIZE_MB = 50;
const MAX_PAGES = 50;
const MAX_DIMENSION = 3000;
const DEFAULT_SCALE = 2;

/**
 * Convert a PDF file into an array of PNG File objects (one per page).
 * @param {File} file - The PDF file to convert
 * @param {object} opts
 * @param {number} [opts.scale=2] - Render scale factor
 * @param {(current: number, total: number) => void} [opts.onProgress] - Progress callback
 * @returns {Promise<File[]>} Array of PNG File objects
 */
export async function pdfToImages(file, { scale = DEFAULT_SCALE, onProgress } = {}) {
  if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
    throw new Error(`PDF is too large (max ${MAX_PDF_SIZE_MB}MB).`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  if (doc.numPages === 0) {
    throw new Error("This PDF has no pages.");
  }
  if (doc.numPages > MAX_PAGES) {
    throw new Error(`PDF has ${doc.numPages} pages (max ${MAX_PAGES}).`);
  }

  const images = [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    let viewport = page.getViewport({ scale });

    // Cap dimensions to avoid memory issues
    if (viewport.width > MAX_DIMENSION || viewport.height > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / viewport.width, MAX_DIMENSION / viewport.height);
      viewport = page.getViewport({ scale: scale * ratio });
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const pageNum = String(i).padStart(3, "0");
    const baseName = file.name.replace(/\.pdf$/i, "");
    const pageFile = new File([blob], `${baseName}-page-${pageNum}.png`, { type: "image/png" });

    images.push(pageFile);
    onProgress?.(i, doc.numPages);
  }

  return images;
}
