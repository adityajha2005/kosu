"use client";
import { useRouter } from 'next/navigation';
import { Suspense } from "react";
import { useEffect, useState } from 'react';
import { JobMatch } from '../../types/aiAgent';
import { getAgents, talentScoutAgent, Agent, runAgent, pauseAgent, activateAgent, trainAgent } from '../../services/aiAgentService';
import AgentInteraction from '../../components/AgentInteraction';
import CreateAgentModal from '../../components/CreateAgentModal';
import ResumeUploader from '../../components/ResumeUploader';
import RegisteredHackathons from '../../components/RegisteredHackathons';
import NFTMinter from '../../components/NFTMinter';
import UserProfileForm from '../../components/UserProfileForm';
import UserProfileCard from '../../components/UserProfileCard';

// Let's update the ResumeUploader component to accept an onError prop
interface ExtendedResumeUploaderProps {
  talentScoutAgent: Agent;
  onAnalysisComplete: (matches: JobMatch[], skills: string[]) => void;
  onError: (error: string) => void;
}

// Extend the AgentInteraction component to accept an onClose prop
interface ExtendedAgentInteractionProps {
  agent: Agent;
  onAgentUpdate: (updatedAgent: Agent) => void;
  onClose: () => void;
  onPauseAgent: (agent: Agent) => Promise<void>;
  onActivateAgent: (agent: Agent) => Promise<void>;
  onTrainAgent: (agent: Agent, trainingData: string) => Promise<void>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'matches' | 'profile'>('dashboard');
  const [address, setAddress] = useState<string | null>(null);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [aiAgents, setAiAgents] = useState<Agent[]>(getAgents());
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isResumeAnalyzed, setIsResumeAnalyzed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string>('Resume analysis complete! View your job matches.');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([
    {
      id: '1',
      title: 'Senior Blockchain Developer',
      company: 'Aptos Labs',
      location: 'Remote',
      matchPercentage: 92,
      description: 'Based on your AI assessment, you&apos;re an excellent match for this position.',
      skills: ['Blockchain', 'Smart Contracts', 'Aptos', 'Move']
    },
    {
      id: '2',
      title: 'AI Integration Specialist',
      company: 'MOVE AI',
      location: 'San Francisco',
      matchPercentage: 87,
      description: 'Your skills in machine learning and blockchain are a strong fit for this role.',
      skills: ['Machine Learning', 'AI', 'API Integration', 'Python']
    },
    {
      id: '3',
      title: 'Web3 Product Manager',
      company: 'Decentralized Systems',
      location: 'Singapore',
      matchPercentage: 78,
      description: 'Your leadership skills and technical background make you a good candidate.',
      skills: ['Product Management', 'Web3', 'Blockchain', 'Leadership']
    }
  ]);
  
  const router = useRouter();

  // Remove the URL parameter effect and update tab navigation functions
  const navigateToTab = (tab: 'dashboard' | 'agents' | 'matches' | 'profile') => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Check if user is connected
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedAddress = localStorage.getItem('userWalletAddress');
          if (storedAddress) {
            setAddress(storedAddress);
          } else {
            // Redirect to home if not connected
            router.push('/');
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        router.push('/');
      }
    };
    
    checkConnection();
  }, [router]);

  // Simulate assessment progress
  useEffect(() => {
    if (isAssessmentStarted && assessmentProgress < 100) {
      const timer = setTimeout(() => {
        setAssessmentProgress(prev => Math.min(prev + 10, 100));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAssessmentStarted, assessmentProgress]);

  const startAssessment = () => {
    setIsAssessmentStarted(true);
    setAssessmentProgress(10);
  };

  const deployNewAgent = () => {
    setIsCreateModalOpen(true);
  };

  const handleAgentCreated = (newAgent: Agent) => {
    setAiAgents(prev => [...prev, newAgent]);
  };

  const handleAgentUpdate = (updatedAgent: Agent) => {
    setAiAgents(prev => 
      prev.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent)
    );
    
    if (selectedAgent && selectedAgent.id === updatedAgent.id) {
      setSelectedAgent(updatedAgent);
    }
  };

  const handlePauseAgent = async (agent: Agent) => {
    try {
      const updatedAgent = pauseAgent(agent);
      handleAgentUpdate(updatedAgent);
    } catch (error) {
      console.error('Error pausing agent:', error);
    }
  };

  const handleActivateAgent = async (agent: Agent) => {
    try {
      const updatedAgent = activateAgent(agent);
      handleAgentUpdate(updatedAgent);
    } catch (error) {
      console.error('Error activating agent:', error);
    }
  };

  const handleTrainAgent = async (agent: Agent, trainingData: string) => {
    try {
      const updatedAgent = await trainAgent(agent, trainingData);
      handleAgentUpdate(updatedAgent);
    } catch (error) {
      console.error('Error training agent:', error);
    }
  };

  const handleResumeAnalysisComplete = (matches: JobMatch[], skills: string[]) => {
    if (!matches.length) {
      setAnalysisError('No job matches found. Please try again with a more detailed resume.');
      return;
    }
    
    if (!skills.length) {
      setAnalysisError('No skills were identified in your resume. Please upload a resume with more detailed skill information.');
      return;
    }
    
    // Sort matches by match percentage in descending order
    const sortedMatches = [...matches].sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    setJobMatches(sortedMatches);
    setExtractedSkills(skills);
    setIsResumeAnalyzed(true);
    setNotificationMessage('Resume analysis complete! View your job matches.');
    setShowNotification(true);
    setAnalysisError(null);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    
    // Automatically switch to matches tab to show results
    setActiveTab('matches');
    
    console.log('Resume analysis complete:', { matches: sortedMatches, skills });
  };

  const handleProfileUpdate = () => {
    setIsProfileComplete(true);
    setNotificationMessage('Profile updated successfully!');
    // setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const navigateToProfileTab = () => {
    setActiveTab('profile');
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-gray-900 text-white">
   
      <div className="container mx-auto px-4 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className="bg-green-900/80 backdrop-blur-sm border border-green-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
              <div className="mr-3 bg-green-500 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{notificationMessage}</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="ml-auto text-green-200 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Error notification */}
        {analysisError && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className="bg-red-900/80 backdrop-blur-sm border border-red-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
              <div className="mr-3 bg-red-500 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{analysisError}</p>
              </div>
              <button 
                onClick={() => setAnalysisError(null)}
                className="ml-auto text-red-200 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your AI agents and view job matches</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-gray-800 rounded-lg p-1 flex flex-wrap">
              <button 
                onClick={() => navigateToTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigateToTab('profile')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Profile
              </button>
              <button 
                onClick={() => navigateToTab('agents')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'agents' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                AI Agents
              </button>
              <button 
                onClick={() => navigateToTab('matches')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'matches' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Job Matches
              </button>
            </div>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && address && (
          <div className="max-w-3xl mx-auto">
            <UserProfileForm 
              walletAddress={address} 
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Existing dashboard content */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Welcome to KOSU</h2>
                <p className="text-gray-300 mb-4">
                  Your AI-powered career platform for the blockchain industry. Upload your resume to get started with personalized job matches and AI agents.
                </p>
                
                {!isResumeAnalyzed ? (
                  <ResumeUploader 
                    talentScoutAgent={aiAgents.find(agent => agent.name === 'TalentScout') || aiAgents[0]}
                    onAnalysisComplete={handleResumeAnalysisComplete} 
                    onError={(error) => setAnalysisError(error)}
                  />
                ) : (
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                    <h3 className="font-semibold text-green-400 mb-2">Resume Analysis Complete</h3>
                    <p className="text-gray-300 text-sm">
                      Your resume has been analyzed and your skills have been extracted. View your job matches in the "Job Matches" tab.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Job matches preview */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-400">Top Job Matches</h2>
                  <button 
                    onClick={() => navigateToTab('matches')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {jobMatches.slice(0, 2).map(job => (
                    <div key={job.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-white">{job.title}</h3>
                        <span className="text-green-400 font-medium">{job.matchPercentage}% Match</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">{job.company} • {job.location}</div>
                      <p className="text-gray-300 text-sm mt-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.map(skill => (
                          <span key={skill} className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* User Profile Card */}
              {address && (
                <UserProfileCard 
                  walletAddress={address} 
                  onEditProfile={navigateToProfileTab}
                />
              )}
              
              {/* New Registered Hackathons Component */}
              <RegisteredHackathons userAddress={address} />
              
              {/* NFT Minter Component */}
              <NFTMinter 
                userAddress={address} 
                onMintSuccess={() => {
                  // Show success notification
                  setNotificationMessage('NFT minted successfully! Check your wallet for the new NFT.');
                  setShowNotification(true);
                  setTimeout(() => {
                    setShowNotification(false);
                  }, 5000);
                }}
                onMintError={(error) => {
                  setAnalysisError(error);
                }}
              />
              
              {/* AI Agents preview */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-400">Your AI Agents</h2>
                  <button 
                    onClick={() => navigateToTab('agents')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {aiAgents.slice(0, 2).map(agent => (
                    <div key={agent.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold">{agent.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{agent.name}</h3>
                          <div className="text-gray-400 text-sm">{agent.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  
                  <button 
                    onClick={deployNewAgent}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                  >
                    Deploy New Agent
                  </button>
                </div>
    
              </div>
              
            </div>
            
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your AI Agents</h2>
              <button 
                onClick={deployNewAgent}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Deploy New Agent
              </button>
            </div>
            
            {selectedAgent ? (
              <div className="space-y-4">
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to all agents
                </button>
                
                <AgentInteraction 
                  agent={selectedAgent}
                  onAgentUpdate={handleAgentUpdate}
                  onClose={() => setSelectedAgent(null)}
                  onPauseAgent={handlePauseAgent}
                  onActivateAgent={handleActivateAgent}
                  onTrainAgent={handleTrainAgent}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiAgents.map((agent: Agent) => (
                  <div 
                    key={agent.id}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-transform hover:scale-[1.02] ${
                      selectedAgent ? (selectedAgent.id === agent.id ? 'ring-2 ring-blue-500' : '') : ''
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{agent.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {agent.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{agent.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Type: {agent.type}</span>
                      <span>Last active: {typeof agent.lastActive === 'string' ? agent.lastActive : agent.lastActive.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'matches' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Matches</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600">
                  <option>Match %</option>
                  <option>Recent</option>
                  <option>Company</option>
                </select>
              </div>
            </div>
            
            {isResumeAnalyzed && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Resume Analysis Complete</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Our AI has analyzed your resume and found {jobMatches.length} job matches based on your skills and experience.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {extractedSkills.length > 3 && (
                      <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-xs">
                        +{extractedSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {jobMatches.map(job => (
                <div key={job.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-blue-400">{job.title}</h3>
                          <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.matchPercentage >= 80 ? 'bg-green-500/20 text-green-400' : 
                          job.matchPercentage >= 60 ? 'bg-blue-500/20 text-blue-400' :
                          job.matchPercentage >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                          job.matchPercentage >= 20 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {job.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">{job.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills?.map((skill, index) => (
                          <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 md:flex-col md:w-32">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors">
                        Apply Now
                      </button>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isCreateModalOpen && (
        <CreateAgentModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)} 
          onAgentCreated={handleAgentCreated}
        />
      )}
    </div>
    </Suspense>
  );
}
