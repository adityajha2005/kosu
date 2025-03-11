import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js for browser environment
export const initPdfJs = () => {
  if (typeof window !== 'undefined') {
    try {
      // Use CDN for PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    } catch (error) {
      console.warn('Failed to load PDF.js worker from CDN, using local fallback', error);
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
  }
};

/**
 * Extract text from a PDF file
 * @param file PDF file to extract text from
 * @returns Promise resolving to the extracted text
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    
    // Load PDF with enhanced options to handle various PDF types
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/standard_fonts/',
      password: '',
      verbosity: 1
    });
    
    const pdf = await loadingTask.promise;
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText || fullText.trim().length < 10) {
      throw new Error('Could not extract meaningful text from your PDF. It may be an image-based or scanned document.');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('password') && errorMessage.includes('required')) {
        throw new Error('Your PDF appears to be password-protected. Please upload an unprotected PDF file.');
      } else if (errorMessage.includes('image') || errorMessage.includes('scan') || 
                 (errorMessage.includes('text') && errorMessage.includes('extract'))) {
        throw new Error('Your PDF appears to be an image or scanned document. Please upload a PDF with selectable text.');
      } else if (errorMessage.includes('corrupt') || errorMessage.includes('invalid') || 
                 errorMessage.includes('malformed') || errorMessage.includes('unexpected')) {
        throw new Error('Your PDF file appears to be corrupted or invalid. Please try a different file.');
      } else if (errorMessage.includes('network') || errorMessage.includes('failed to fetch')) {
        throw new Error('Failed to load PDF resources. Please check your internet connection and try again.');
      }
    }
    
    throw new Error('Failed to process your PDF. Please try uploading a different PDF or a text file instead.');
  }
};

/**
 * Extract text from a file (PDF or text)
 * @param file File to extract text from
 * @returns Promise resolving to the extracted text
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    if (file.type === 'text/plain') {
      // For text files, read directly
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      return text;
    } else if (file.type === 'application/pdf') {
      return await extractTextFromPdf(file);
    } else {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF or text file.`);
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to extract text from file');
    }
  }
}; 