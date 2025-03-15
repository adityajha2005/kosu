"use client"
// @ts-nocheck;
import { useState } from 'react';
import { AgentRunResult } from '../types/aiAgent';
import { runAgent, trainAgent, Agent } from '../services/aiAgentService';

interface AgentInteractionProps {
  agent: Agent;
  onAgentUpdate: (updatedAgent: Agent) => void;
  onClose: () => void;
  onPauseAgent: (agent: Agent) => Promise<void>;
  onActivateAgent: (agent: Agent) => Promise<void>;
  onTrainAgent: (agent: Agent, trainingData: string) => Promise<void>;
}

export default function AgentInteraction({ 
  agent, 
  onAgentUpdate, 
  onClose,
  onPauseAgent,
  onActivateAgent,
  onTrainAgent
}: AgentInteractionProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AgentRunResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trainingData, setTrainingData] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState<'run' | 'train'>('run');

  const handleRunAgent = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await runAgent(agent, input);
      setResult(response);
      
      // Update the agent's last active time
      onAgentUpdate({
        ...agent,
        lastActive: new Date()
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainAgent = async () => {
    if (!trainingData.trim()) return;
    
    setIsTraining(true);
    
    try {
      const updatedAgent = await trainAgent(agent, trainingData);
      onAgentUpdate(updatedAgent);
    } catch (error) {
      console.error('Error training agent:', error);
    } finally {
      setIsTraining(false);
    }
  };

  // Add a close button handler
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
        <span className={`text-xs px-2 py-1 rounded-full ${
          agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 
          'bg-gray-500/20 text-gray-400'
        }`}>
          {agent.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
      
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Endpoint:</span>
          <span className="text-xs text-blue-400">{agent.endpoint}</span>
        </div>
        <div className="h-4 w-px bg-gray-700"></div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Last active:</span>
          <span className="text-xs text-gray-400">{typeof agent.lastActive === 'string' ? agent.lastActive : agent.lastActive.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex border-b border-gray-700 mb-4">
        <button 
          onClick={() => setActiveTab('run')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'run' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Run Agent
        </button>
        <button 
          onClick={() => setActiveTab('train')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'train' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Train Agent
        </button>
      </div>
      
      {activeTab === 'run' ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Input</label>
            <textarea 
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
              rows={4}
              placeholder={agent.status === 'active' 
                ? `Enter input for ${agent.name}...` 
                : `${agent.name} is not active. Activate it first.`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={agent.status !== 'active' || isLoading}
            />
          </div>
          
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors mb-4 flex justify-center items-center"
            onClick={handleRunAgent}
            disabled={agent.status !== 'active' || isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Run Agent'
            )}
          </button>
          
          {result && (
            <div className={`border ${result.success ? 'border-green-600' : 'border-red-600'} rounded-md p-3 mb-4`}>
              <h3 className={`text-sm font-medium mb-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? 'Result' : 'Error'}
              </h3>
              <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                {JSON.stringify(result.success ? result.result : result.error, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Agent Type</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                {agent.type}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Training Data</label>
            <textarea 
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
              rows={4}
              placeholder="Enter training data (e.g., resume, job descriptions, skills)..."
              value={trainingData}
              onChange={(e) => setTrainingData(e.target.value)}
              disabled={isTraining}
            />
          </div>
          
          <button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors mb-4 flex justify-center items-center"
            onClick={handleTrainAgent}
            disabled={isTraining || !trainingData.trim()}
          >
            {isTraining ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Train Agent'
            )}
          </button>
          
          <div className="text-xs text-gray-500">
            <p>Training helps the agent learn from your data and improve its performance.</p>
            <p className="mt-1">Examples of good training data:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Resume content</li>
              <li>Job descriptions</li>
              <li>Skill lists</li>
              <li>Previous interview questions</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 