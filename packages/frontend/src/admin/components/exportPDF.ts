// exportPDF.ts
import jsPDF from 'jspdf';

export type ExportOptions = {
  filename?: string;
  format?: string | number[]; // 'a4' | [w,h]
  orientation?: 'portrait' | 'landscape';
  marginMm?: number;
  imageType?: 'PNG' | 'JPEG';
  quality?: number; // for JPEG: 0..1
  multiPage?: boolean;
  headerRight?: string | null; // טקסט שיופיע בפינה הימנית עליונה (למשל 'בסד'); אם null או '' -> לא יוצג
  fontUrl?: string; // אופציונלי: URL לקובץ פונט (TTF) שתומך בעברית
  fontName?: string; // שם הפונט לשימוש ב‑jsPDF (לדוגמה 'Alef')
  useTitleAsFilename?: boolean;
};

/** load image from dataUrl */
async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

/** convert ArrayBuffer -> base64 using FileReader (browser-safe) */
// function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
//   return new Promise((resolve, reject) => {
//     try {
//       const blob = new Blob([buffer]);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const dataUrl = reader.result as string;
//         const comma = dataUrl.indexOf(',');
//         const base64 = dataUrl.substring(comma + 1);
//         resolve(base64);
//       };
//       reader.onerror = (err) => reject(err);
//       reader.readAsDataURL(blob);
//     } catch (e) {
//       reject(e);
//     }
//   });
// }

/** sanitize filename: remove illegal chars and trim length */
function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[/\\:*?"<>|\n\r\t]+/g, ' ').trim();
  return cleaned.substring(0, 160) || 'export';
}

/** embed font into jsPDF instance from a URL (fetch -> base64 -> addFileToVFS + addFont) */
// async function embedFontFromUrl(pdf: jsPDF, fontUrl: string, fontName = 'CustomFont'): Promise<void> {
//   const res = await fetch(fontUrl);
//   if (!res.ok) throw new Error(`Failed fetching font from ${fontUrl}: ${res.status}`);
//   const buffer = await res.arrayBuffer();
//   const base64 = await arrayBufferToBase64(buffer);
//   const fileName = `${fontName}.ttf`;
//   (pdf as any).addFileToVFS(fileName, base64);
//   (pdf as any).addFont(fileName, fontName, 'normal');
// }

/** detect presence of Hebrew characters */
function containsHebrew(text?: string): boolean {
  if (!text) return false;
  return /[\u0590-\u05FF]/.test(text);
}

/**
 * Very simple RTL fix for short Hebrew strings:
 * - reverse the character order so jsPDF (LTR) will show the word visually in correct direction.
 * Note: this is a heuristic that works for short words like "בסד" and most titles.
 * For complex bidi/shaping you should use a dedicated bidi/reshaper library or render text into the DOM.
 */
function prepareRtlForPdf(text: string): string {
  // if no hebrew, return as-is
  if (!containsHebrew(text)) return text;
  // Reverse the string by Unicode codepoints (Array.from handles surrogate pairs)
  return Array.from(text).reverse().join('');
}

/**
 * Export image dataURL directly to PDF, with centered title and optional header-right text on each page.
 * headerRight defaults to 'בסד' unless explicitly set to null/'' in opts.
 */
export async function exportImageDataToPdf(
  dataUrl: string,
  title?: string,
  opts: ExportOptions = {}
): Promise<void> {
  const {
    filename: filenameOpt,
    format = 'a4',
    orientation = 'portrait',
    marginMm = 8,
    imageType = 'PNG',
    quality = 0.92,
    multiPage = true,
    useTitleAsFilename = true,
  } = opts;

  // default headerRight to 'בסד' unless explicitly null/empty-string provided

  // compute filename: if useTitleAsFilename and title provided -> use it
  let filename = filenameOpt ?? 'chart.pdf';
  if (useTitleAsFilename && title) {
    filename = `${sanitizeFilename(title)}.pdf`;
  }

  // load image element
  const img = await loadImage(dataUrl);

  // create PDF
  const pdf = new jsPDF({ orientation, unit: 'mm', format: (format as any) });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // font sizes
  const titleFontSize = 14;

  // reserve space for title on first page (in mm)
  const titleSpaceMm = title ? 10 : 0;
  const usablePageHeight = pageHeight - marginMm * 2 - titleSpaceMm;

  // compute image sizes in mm to fit width
  const imgWpx = img.naturalWidth;
  const imgHpx = img.naturalHeight;
  const imgWidthMm = pageWidth - marginMm * 2;
  const pxPerMm = imgWpx / imgWidthMm;
  const imgHeightMm = imgHpx / pxPerMm;

  

  // helper draw centered title on first page
  const drawTitle = () => {
    if (!title) return;
    pdf.setFontSize(titleFontSize);

    let titleToWrite = title;
    if (containsHebrew(title)) {
      titleToWrite = prepareRtlForPdf(title);
    }

    const x = pageWidth / 2;
    const y = marginMm + (titleFontSize / 2);
    pdf.text(titleToWrite, x, y, { align: 'center' });
  };

  // single page case
  if (!multiPage || imgHeightMm <= usablePageHeight) {
    drawTitle();
    const yStart = marginMm + titleSpaceMm + Math.max(0, (usablePageHeight - imgHeightMm) / 2);
    pdf.addImage(dataUrl, imageType, marginMm, yStart, imgWidthMm, imgHeightMm, undefined, 'FAST');
    pdf.save(filename);
    return;
  }

  // multi-page: slice vertically
  const sliceHeightPx = Math.floor(usablePageHeight * pxPerMm);

  const bigCanvas = document.createElement('canvas');
  bigCanvas.width = imgWpx;
  bigCanvas.height = imgHpx;
  const bigCtx = bigCanvas.getContext('2d');
  if (!bigCtx) throw new Error('Could not get 2D context');
  bigCtx.drawImage(img, 0, 0);

  let yOffsetPx = 0;
  let pageIndex = 0;
  while (yOffsetPx < imgHpx) {
    const remaining = imgHpx - yOffsetPx;
    const currentSlicePx = Math.min(sliceHeightPx, remaining);

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = imgWpx;
    sliceCanvas.height = currentSlicePx;
    const sliceCtx = sliceCanvas.getContext('2d');
    if (!sliceCtx) throw new Error('Could not get 2D context for slice');

    sliceCtx.drawImage(bigCanvas, 0, yOffsetPx, imgWpx, currentSlicePx, 0, 0, imgWpx, currentSlicePx);
    const sliceDataUrl = sliceCanvas.toDataURL(`image/${imageType.toLowerCase()}`, quality);
    const sliceHeightMm = currentSlicePx / pxPerMm;

    if (pageIndex > 0) pdf.addPage();

    if (pageIndex === 0) drawTitle();

    const y = marginMm + (pageIndex === 0 ? titleSpaceMm : 0);
    pdf.addImage(sliceDataUrl, imageType, marginMm, y, imgWidthMm, sliceHeightMm, undefined, 'FAST');

    yOffsetPx += currentSlicePx;
    pageIndex++;
  }

  pdf.save(filename);
}