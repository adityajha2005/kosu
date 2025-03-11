"use client";
import { useState, useRef, useEffect } from 'react';
import { runAgent, Agent } from '../services/aiAgentService';
import { JobMatch } from '../types/aiAgent';
import { initPdfJs, extractTextFromFile } from '../services/pdfService';

interface ResumeUploaderProps {
  talentScoutAgent: Agent;
  onAnalysisComplete: (matches: JobMatch[], skills: string[]) => void;
}

export default function ResumeUploader({ talentScoutAgent, onAnalysisComplete }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  
  useEffect(() => {
    initPdfJs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/plain' && selectedFile.type !== 'application/pdf') {
        setError('Please upload a text (.txt) or PDF file.');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setUploadProgress(0);
      setAnalysisProgress(0);
    }
  };

  const uploadFile = async (file: File): Promise<boolean> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload with progress updates
      const chunkSize = 10;
      for (let i = 0; i <= 100; i += chunkSize) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setIsUploading(false);
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
      setIsUploading(false);
      return false;
    }
  };

  const analyzeResume = async () => {
    if (!file || !talentScoutAgent) return;
    
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      setError(null);
      setExtractedText(null);
      
      // Step 1: Upload the file
      const uploadSuccess = await uploadFile(file);
      if (!uploadSuccess) {
        throw new Error('Failed to upload file');
      }
      
      // Step 2: Extract text from file
      setAnalysisProgress(30);
      let resumeText;
      try {
        resumeText = await extractTextFromFile(file);
        
        if (isDebugMode) {
          console.log('Extracted text:', resumeText.substring(0, 500) + '...');
          setExtractedText(resumeText);
        }
      } catch (extractError) {
        console.error('Text extraction error:', extractError);
        
        if (extractError instanceof Error) {
          throw extractError;
        } else {
          throw new Error('Failed to extract text from your resume. Please try a different file format.');
        }
      }
      setAnalysisProgress(50);
      
      // Check if we have enough text to analyze
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Your resume does not contain enough text to analyze. Please upload a more detailed resume.');
      }
      
      // Step 3: Analyze the resume using the TalentScout agent
      let analysisResult;
      try {
        analysisResult = await runAgent(talentScoutAgent, resumeText);
        setAnalysisProgress(80);
      } catch (aiError) {
        console.error('AI service error:', aiError);
        throw new Error('Our AI service is currently unavailable. Please try again later.');
      }
      
      if (!analysisResult.success) {
        console.error('AI analysis failed:', analysisResult.error);
        throw new Error(analysisResult.error || 'Failed to analyze resume');
      }
      
      // Step 4: Process the AI response
      setAnalysisProgress(90);
      
      const extractedSkills = analysisResult.result.extractedSkills || [];
      const jobMatches = analysisResult.result.jobMatches || [];
      
      if (extractedSkills.length === 0) {
        throw new Error('No skills were identified in your resume. Please upload a resume with more detailed skill information.');
      }
      
      if (jobMatches.length === 0) {
        throw new Error('No job matches were found based on your resume. Please upload a resume with more detailed experience information.');
      }
      
      setAnalysisProgress(100);
      
      onAnalysisComplete(jobMatches, extractedSkills);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      
      let errorMessage = 'Failed to analyze resume. Please try again.';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setAnalysisProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      await analyzeResume();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setAnalysisProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Upload Your Resume</h2>
      <p className="text-gray-400 text-sm mb-6">
        Upload your resume to get personalized job matches based on your skills and experience.
        Our AI will analyze your resume and find the best opportunities for you.
      </p>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-md mb-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          
          {error.includes('image') || error.includes('scanned') || error.includes('extract') || error.includes('PDF') || error.includes('pdf') ? (
            <div className="mt-2 ml-7">
              <p className="text-red-400 text-sm font-medium">How to fix this:</p>
              <ol className="text-red-400 text-sm mt-1 list-decimal pl-4 space-y-1">
                <li>If you have the original document (Word, Google Docs), export it as PDF again</li>
                <li>If you only have a scanned copy, try using an OCR tool to convert it to text</li>
                <li>Alternatively, you can copy the text from your resume and save it as a .txt file</li>
              </ol>
              
              <div className="mt-3 p-2 bg-gray-800 rounded-md">
                <p className="text-amber-400 text-xs font-medium">Try our text file option instead:</p>
                <p className="text-gray-400 text-xs mt-1">
                  1. Open your resume in any text editor or word processor
                </p>
                <p className="text-gray-400 text-xs">
                  2. Copy all the text (Ctrl+A, then Ctrl+C)
                </p>
                <p className="text-gray-400 text-xs">
                  3. Paste into a new text file (Ctrl+V) and save as .txt
                </p>
                <p className="text-gray-400 text-xs">
                  4. Upload the .txt file here
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={resetUpload}
                    className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try with a text file
                  </button>
                  <a
                    href="/sample-resume-template.txt"
                    download
                    className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download template
                  </a>
                </div>
              </div>
            </div>
          ) : null}
          
          {error.includes('password-protected') && (
            <div className="mt-2 ml-7">
              <p className="text-red-400 text-sm font-medium">How to fix this:</p>
              <ol className="text-red-400 text-sm mt-1 list-decimal pl-4 space-y-1">
                <li>Open your PDF in a PDF reader</li>
                <li>Remove the password protection (usually in the Security or Protection settings)</li>
                <li>Save the PDF and upload it again</li>
              </ol>
            </div>
          )}
          
          {(error.includes('API') || error.includes('service') || error.includes('unavailable')) && (
            <div className="mt-2 ml-7">
              <p className="text-red-400 text-sm">
                Our AI service might be experiencing high demand. Please try again in a few minutes.
              </p>
              <button
                onClick={() => file && analyzeResume()}
                className="mt-2 bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                disabled={isUploading || isAnalyzing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Analysis
              </button>
            </div>
          )}
          
          {(error.includes('Invalid input format') || error.includes('Missing required parameters') || error.includes('Bad request')) && (
            <div className="mt-2 ml-7">
              <p className="text-red-400 text-sm">
                There's a technical issue with our AI model configuration. Our team has been notified.
              </p>
              <p className="text-red-400 text-sm mt-1">
                Please try again later or contact support if the issue persists.
              </p>
            </div>
          )}
        </div>
      )}
      
      {error && error.includes('PDF') && (
        <div className="mt-2 text-right">
          <button
            onClick={() => setIsDebugMode(!isDebugMode)}
            className="text-gray-500 hover:text-gray-400 text-xs underline"
          >
            {isDebugMode ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
      )}
      
      {isDebugMode && extractedText && (
        <div className="mt-2 p-3 bg-gray-800 rounded border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Extracted Text (Debug Mode)</h3>
          <div className="max-h-40 overflow-y-auto text-xs text-gray-400 font-mono whitespace-pre-wrap bg-gray-900 p-2 rounded">
            {extractedText || 'No text extracted'}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            If you see text above, your PDF contains extractable text but there might be an issue with our processing.
            Please try again or contact support.
          </p>
        </div>
      )}
      
      {isDebugMode && !extractedText && error && (
        <div className="mt-2 p-3 bg-gray-800 rounded border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Debug Information</h3>
          <div className="text-xs text-gray-400">
            <p>File type: {file?.type}</p>
            <p>File size: {file ? (file.size / 1024).toFixed(2) + ' KB' : 'Unknown'}</p>
            <p>Error: {error}</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This information can help our support team diagnose the issue.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {!file ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.txt,text/plain"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={isUploading || isAnalyzing}
              />
              <div className="flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 mb-2">Drag and drop your resume here, or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={isUploading || isAnalyzing}
                >
                  Browse Files
                </button>
                <p className="text-gray-500 text-xs mt-2">Supported formats: .pdf, .txt</p>
                <p className="text-gray-500 text-xs mt-1">Maximum file size: 5MB</p>
                <p className="text-yellow-500 text-xs mt-2">Note: Make sure your PDF is not password-protected and contains selectable text.</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-gray-400 hover:text-white"
                  disabled={isUploading || isAnalyzing}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {(isUploading || uploadProgress > 0) && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Uploading</span>
                    <span className="text-blue-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {(isAnalyzing || analysisProgress > 0) && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Analyzing</span>
                    <span className="text-purple-400">{analysisProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-colors flex justify-center items-center"
          disabled={!file || isUploading || isAnalyzing}
        >
          {isUploading || isAnalyzing ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </form>
      
      <div className="mt-6 p-3 bg-gray-700/50 rounded-md">
        <h3 className="text-sm font-medium text-gray-300 mb-2">How It Works</h3>
        <ol className="text-xs text-gray-400 space-y-1 list-decimal pl-4">
          <li>Upload your resume in PDF or TXT format</li>
          <li>Our AI extracts and analyzes your skills, experience, and qualifications</li>
          <li>We match you with the most relevant job opportunities</li>
          <li>Review your personalized job matches and apply</li>
        </ol>
        <p className="text-xs text-gray-400 mt-2">For best results with PDF files:</p>
        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4 mt-1">
          <li>Ensure your PDF is not password-protected</li>
          <li>Use PDFs with selectable text (not scanned images)</li>
          <li>Keep formatting simple for better text extraction</li>
        </ul>
      </div>
    </div>
  );
} 