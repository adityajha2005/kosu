"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobMatch } from '../../types/aiAgent';
import { getAgents, talentScoutAgent, Agent, runAgent, pauseAgent, activateAgent, trainAgent } from '../../services/aiAgentService';
import AgentInteraction from '../../components/AgentInteraction';
import CreateAgentModal from '../../components/CreateAgentModal';
import ResumeUploader from '../../components/ResumeUploader';

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'matches'>('dashboard');
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [aiAgents, setAiAgents] = useState<Agent[]>(getAgents());
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isResumeAnalyzed, setIsResumeAnalyzed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
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

  useEffect(() => {
    // Check if user is logged in
    const userAddress = localStorage.getItem('userWalletAddress');
    if (!userAddress) {
      // Redirect to home if not logged in
      router.push('/');
      return;
    }
    
    setAddress(userAddress);
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

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
          AI Talent Matchmaking Platform
        </h1>
        <p className="text-gray-400 mb-6">Redefining hiring in Web3 and AI-native industries</p>
        
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-900/90 border border-green-700 text-green-400 px-4 py-3 rounded-md shadow-lg z-50 animate-fade-in-down">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Resume analysis complete! View your job matches.</span>
              <button 
                onClick={() => setShowNotification(false)}
                className="ml-2 text-green-400 hover:text-green-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Error Notification */}
        {analysisError && (
          <div className="fixed top-4 right-4 bg-red-900/90 border border-red-700 text-red-400 px-4 py-3 rounded-md shadow-lg z-50 animate-fade-in-down">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-medium">Analysis Error</span>
                <p className="text-sm">{analysisError}</p>
                {(analysisError.includes('API') || analysisError.includes('service') || analysisError.includes('unavailable')) && (
                  <p className="text-sm mt-1">
                    Our AI service might be experiencing high demand. Please try again in a few minutes.
                  </p>
                )}
              </div>
              <button 
                onClick={() => setAnalysisError(null)}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 font-medium ${activeTab === 'agents' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            AI Agents
          </button>
          <button 
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 font-medium ${activeTab === 'matches' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Job Matches
          </button>
        </div>
        
        {activeTab === 'dashboard' && (
          <>
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Your Wallet</h2>
                  <div className="bg-gray-700 p-3 rounded-md overflow-x-auto mb-4">
                    <code className="text-blue-300">{address}</code>
                  </div>
                  <span className="text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full">
                    Verified ✓
                  </span>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="text-right">
                    <span className="text-gray-400">Profile Completion</span>
                    <div className="w-full md:w-64 h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">65% Complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">AI Assessment</h2>
                  <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {isAssessmentStarted ? (
                  <div>
                    <div className="mb-2 flex justify-between">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-blue-400">{assessmentProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${assessmentProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {assessmentProgress < 100 
                        ? "AI is analyzing your skills and experience..." 
                        : "Assessment complete! View your matches."}
                    </p>
                    {assessmentProgress === 100 && (
                      <button 
                        onClick={() => setActiveTab('matches')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      >
                        View Matches
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 mb-4">AI-powered skill and personality assessment to match you with ideal roles.</p>
                    <div className="space-y-2">
                      <button 
                        onClick={startAssessment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      >
                        Start Assessment
                      </button>
                      <div className="flex items-center justify-center">
                        <span className="text-gray-500 text-sm px-2">or</span>
                      </div>
                      <button 
                        onClick={() => document.getElementById('resume-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V9" />
                        </svg>
                        Upload Resume
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Credentials</h2>
                  <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">On-chain verifiable credentials ensuring trust and authenticity in hiring.</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Blockchain Development</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Smart Contract Auditing</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">AI Integration</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Pending</span>
                  </div>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                  Manage Credentials
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">AI Agent Tokens</h2>
                  <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">AI Agent Token Launchpad for seamless deployment of hiring assessments.</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Active Agents</span>
                    <span className="text-sm text-white">{aiAgents.filter(a => a.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Learning Agents</span>
                    <span className="text-sm text-white">{aiAgents.filter(a => a.status === 'learning').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Available Tokens</span>
                    <span className="text-sm text-white">5 MOVE</span>
                  </div>
                </div>
                <button 
                  onClick={deployNewAgent}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  Deploy New Agent
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Job Matches</h2>
                  <button 
                    onClick={() => setActiveTab('matches')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {jobMatches.slice(0, 2).map(job => (
                    <div key={job.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
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
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Active AI Agents</h2>
                  <button 
                    onClick={() => setActiveTab('agents')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {aiAgents.filter(agent => agent.status === 'active').map((agent: Agent) => (
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
              </div>
            </div>

            {/* Resume Upload Section */}
            <div id="resume-section" className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
              {analysisError && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-md mb-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-medium">Analysis Error</span>
                      <p>{analysisError}</p>
                      {(analysisError.includes('API') || analysisError.includes('service') || analysisError.includes('unavailable')) && (
                        <p className="text-sm mt-1">
                          Please try again later or contact support if the issue persists.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResumeUploader 
                  talentScoutAgent={aiAgents.find(agent => agent.name === 'TalentScout') || aiAgents[0]} 
                  onAnalysisComplete={handleResumeAnalysisComplete} 
                />
                
                {isResumeAnalyzed && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
                    <p className="text-gray-400 mb-4">Based on your resume, our AI has identified the following skills:</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {extractedSkills.length > 0 ? (
                        extractedSkills.map((skill, index) => (
                          <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills identified. Please upload a more detailed resume.</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab('matches')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      View Job Matches
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
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
      
      <CreateAgentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAgentCreated={handleAgentCreated}
      />
    </div>
  );
}
