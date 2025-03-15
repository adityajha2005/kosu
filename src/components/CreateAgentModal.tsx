"use client"
// @ts-nocheck;
import { useState } from 'react';
import { Agent, ModelType } from '../services/aiAgentService';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: (agent: Agent) => void;
}

export default function CreateAgentModal({ isOpen, onClose, onAgentCreated }: CreateAgentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modelType, setModelType] = useState<ModelType>(ModelType.TALENT_SCOUT);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) return;
    
    setIsCreating(true);
    
    try {
      // Create a new agent with the specified properties
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        endpoint: getEndpointForModelType(modelType),
        status: 'inactive',
        type: modelType,
        lastActive: 'Never'
      };
      
      onAgentCreated(newAgent);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating agent:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getEndpointForModelType = (type: ModelType): string => {
    switch (type) {
      case ModelType.TALENT_SCOUT:
        return 'facebook/bart-large-mnli';
      case ModelType.RESUME_ANALYZER:
        return 'distilbert-base-uncased-finetuned-sst-2-english';
      case ModelType.SKILL_VERIFIER:
        return 'deepset/roberta-base-squad2';
      case ModelType.INTERVIEW_PREP:
        return 'gpt2';
      default:
        return 'bert-base-uncased';
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setModelType(ModelType.TALENT_SCOUT);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Deploy New AI Agent</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Agent Name</label>
              <input 
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                placeholder="e.g., ResumeAnalyzer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Agent Description</label>
              <input 
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                placeholder="e.g., Resume Analysis Specialist"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">Model Type</label>
              <select 
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                value={modelType}
                onChange={(e) => setModelType(e.target.value as ModelType)}
              >
                <option value={ModelType.TALENT_SCOUT}>Talent Scout (BART-large-mnli)</option>
                <option value={ModelType.SKILL_VERIFIER}>Skill Verifier (RoBERTa)</option>
                <option value={ModelType.INTERVIEW_PREP}>Interview Prep (GPT-2)</option>
                <option value={ModelType.RESUME_ANALYZER}>Resume Analyzer (DistilBERT)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select the model that best fits your agent&apos;s purpose.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex justify-center items-center"
                disabled={isCreating || !name.trim() || !description.trim()}
              >
                {isCreating ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Deploy Agent'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 p-3 bg-gray-700/50 rounded-md">
            <h3 className="text-sm font-medium text-gray-300 mb-2">About AI Agent Models</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li><span className="text-blue-400">Talent Scout:</span> Best for matching candidates with jobs</li>
              <li><span className="text-blue-400">Skill Verifier:</span> Validates credentials and skills</li>
              <li><span className="text-blue-400">Interview Prep:</span> Generates interview questions and feedback</li>
              <li><span className="text-blue-400">Resume Analyzer:</span> Extracts skills and experience from resumes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 