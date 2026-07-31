import mammoth from 'mammoth';
import JSZip from 'jszip';

export async function extractFileText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const ext = name.split('.').pop() || '';

  if (ext === 'txt' || ext === 'csv') {
    return await file.text();
  }

  if (ext === 'pdf') {
    return extractPdfText(file);
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (ext === 'pptx') {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const slides: string[] = [];
    const slideFiles = Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/i.test(f));
    slideFiles.sort((a, b) => {
      const na = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
      const nb = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
      return na - nb;
    });
    for (const slideFile of slideFiles) {
      const content = await zip.files[slideFile].async('text');
      const texts = content.match(/<a:t>([^<]*)<\/a:t>/g);
      if (texts) {
        slides.push(texts.map((t) => t.replace(/<\/?a:t>/g, '')).join(' '));
      }
    }
    return slides.join('\n\n');
  }

  if (ext === 'doc') {
    return 'Legacy .doc format is not fully supported. Please convert to .docx for better results.';
  }

  return '';
}

async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default || (worker as unknown as string);
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      pages.push(pageText);
    }
    return pages.join('\n\n');
  } catch {
    return 'Could not extract text from this PDF. It may be scanned or image-based.';
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
