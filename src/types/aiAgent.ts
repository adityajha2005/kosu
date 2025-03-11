import { ModelType } from '../services/aiAgentService';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'learning';
  description: string;
  completionPercentage: number;
  lastActive: string;
  model: string;
  endpoint: string;
  capabilities: string[];
  type?: ModelType;
}

export interface AgentRunResult {
  success: boolean;
  result?: any;
  error?: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  description: string;
  skills?: string[];
  datePosted?: string;
}

export interface AgentTrainingData {
  resume?: string;
  jobDescription?: string;
  skills?: string[];
  experience?: string;
  customData?: Record<string, any>;
} 