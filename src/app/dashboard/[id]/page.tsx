// app/job-quiz/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJobTemplateById } from '@/data/jobs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuizData {
  title: string;
  questions: Question[];
}

export default function JobQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobCompany, setJobCompany] = useState<string>('');
  const [jobDetails, setJobDetails] = useState<{
    location: string;
    requiredSkills: string[];
    criticalSkills: string[];
    importantSkills: string[];
  } | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  useEffect(() => {
    async function fetchJobAndGenerateQuiz() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Step 1: Fetch job template from agentservices
        const jobTemplate = await getJobTemplateById(parseInt(id, 10));
        if (!jobTemplate) {
          throw new Error("Job template not found");
        }
        
        setJobTitle(jobTemplate.title);
        setJobCompany(jobTemplate.company);
        setJobDetails({
          location: jobTemplate.location,
          requiredSkills: jobTemplate.requiredSkills,
          criticalSkills: jobTemplate.criticalSkills,
          importantSkills: jobTemplate.importantSkills
        });
        
        // Step 2: Call Gemini API to generate questions based on job details
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobDetails: jobTemplate,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to generate quiz questions");
        }
        
        // Step 3: Process the response from Gemini
        const data = await response.json();
        setQuizData(data);
        
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobAndGenerateQuiz();
  }, [id]);

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    if (submittedAnswers) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    
    let correctCount = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore({
      correct: correctCount,
      total: quizData.questions.length
    });
    
    setSubmittedAnswers(true);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setSubmittedAnswers(false);
    setScore({ correct: 0, total: 0 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Generating Quiz Questions</h2>
          <p className="text-gray-500">Please wait while we create questions based on the job requirements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push('/')}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{jobTitle} - Knowledge Quiz</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{jobTitle}</p>
          <p className="text-gray-600 mb-4">{jobCompany} • {jobDetails?.location}</p>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Required Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails?.requiredSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Critical Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails?.criticalSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Important Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails?.importantSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quiz Questions</h2>
        
        {submittedAnswers && (
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">
              Score: <span className="text-green-600">{score.correct}</span>/{score.total}
            </div>
            <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
          </div>
        )}
      </div>
      
      {quizData && quizData.questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium mb-3">{question.question}</p>
            {question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[questionIndex] === option;
                  const isCorrect = submittedAnswers && option === question.correctAnswer;
                  const isIncorrect = submittedAnswers && isSelected && option !== question.correctAnswer;
                  
                  return (
                    <div 
                      key={optionIndex} 
                      className={`flex items-start p-2 rounded-md cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      } ${isCorrect ? 'bg-green-50' : ''} ${isIncorrect ? 'bg-red-50' : ''}`}
                      onClick={() => handleSelectAnswer(questionIndex, option)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        isSelected && !submittedAnswers ? 'bg-blue-500 text-white' : 
                        isCorrect ? 'bg-green-500 text-white' : 
                        isIncorrect ? 'bg-red-500 text-white' : 'bg-gray-200'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <p className="flex-1">{option}</p>
                      {submittedAnswers && isCorrect && (
                        <CheckCircle className="text-green-500 ml-2" size={20} />
                      )}
                      {submittedAnswers && isIncorrect && (
                        <XCircle className="text-red-500 ml-2" size={20} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {quizData && !submittedAnswers && (
        <div className="flex justify-center mt-8">
          <Button 
            className="px-8 py-2"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length !== quizData.questions.length}
          >
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
}