import { useState } from 'react';
import { JobMatch } from '../types/aiAgent';
import { X } from 'lucide-react';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobMatch;
  onSubmit: (applicationData: JobApplicationData) => void;
}

export interface JobApplicationData {
  jobId: string;
  github: string;
  linkedin: string;
  coverLetter: string;
  answers: Record<string, string>;
}

export default function JobApplicationModal({ isOpen, onClose, job, onSubmit }: JobApplicationModalProps) {
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate role-specific questions based on job title and skills
  const getJobQuestions = (): { id: string; question: string }[] => {
    const questions = [
      {
        id: 'experience',
        question: `How many years of experience do you have with ${job.skills?.slice(0, 3).join(', ')}?`
      }
    ];

    // Add job-specific questions based on job title
    if (job.title.toLowerCase().includes('blockchain')) {
      questions.push({
        id: 'blockchain',
        question: 'Describe a blockchain project you have worked on and your specific contributions.'
      });
    }

    if (job.title.toLowerCase().includes('ai') || job.skills?.some(skill => skill.toLowerCase().includes('ai') || skill.toLowerCase().includes('machine learning'))) {
      questions.push({
        id: 'ai',
        question: 'What AI/ML frameworks are you most comfortable with, and how have you applied them?'
      });
    }

    if (job.title.toLowerCase().includes('web3')) {
      questions.push({
        id: 'web3',
        question: 'What interests you most about Web3 technology and this specific role?'
      });
    }

    if (job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('engineer')) {
      questions.push({
        id: 'technical',
        question: 'What is your approach to learning new technologies quickly?'
      });
    }

    if (job.title.toLowerCase().includes('product')) {
      questions.push({
        id: 'product',
        question: 'Describe your process for gathering requirements and prioritizing features.'
      });
    }

    // Add a general question for all roles
    questions.push({
      id: 'why',
      question: `Why are you interested in this ${job.title} position at ${job.company}?`
    });

    return questions;
  };

  const questions = getJobQuestions();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!github.trim()) {
      setError('GitHub profile URL is required');
      return false;
    }

    if (!linkedin.trim()) {
      setError('LinkedIn profile URL is required');
      return false;
    }

    // Validate GitHub URL format
    if (!github.includes('github.com')) {
      setError('Please enter a valid GitHub URL');
      return false;
    }

    // Validate LinkedIn URL format
    if (!linkedin.includes('linkedin.com')) {
      setError('Please enter a valid LinkedIn URL');
      return false;
    }

    // Check if all questions are answered
    for (const question of questions) {
      if (!answers[question.id] || !answers[question.id].trim()) {
        setError(`Please answer the question: ${question.question}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare application data
      const applicationData: JobApplicationData = {
        jobId: job.id,
        github,
        linkedin,
        coverLetter,
        answers
      };

      // Submit application
      await onSubmit(applicationData);
      
      // Close modal on success
      onClose();
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error('Application submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Apply for {job.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium text-blue-400">{job.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                job.matchPercentage >= 80 ? 'bg-green-500/20 text-green-400' : 
                job.matchPercentage >= 60 ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {job.matchPercentage}% Match
              </span>
            </div>
            <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
            <p className="text-gray-300 text-sm mt-2">{job.description}</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills?.map((skill, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* GitHub Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub Profile URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                  required
                />
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  LinkedIn Profile URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                  required
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit for this role..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white h-24 resize-none"
                />
              </div>

              {/* Role-specific Questions */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-md font-medium text-white mb-3">Role-specific Questions</h3>
                
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {q.question} <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Your answer..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white h-20 resize-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex justify-center items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 