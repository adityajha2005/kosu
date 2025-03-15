"use client"
// @ts-nocheck;
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
import JobApplicationModal, { JobApplicationData } from '../../components/JobApplicationModal';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

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

// Define a type for job applications
interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  applicationData: JobApplicationData;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'matches' | 'profile' | 'applications'>('dashboard');
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
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isViewApplicationModalOpen, setIsViewApplicationModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
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
  const navigateToTab = (tab: 'dashboard' | 'agents' | 'matches' | 'profile' | 'applications') => {
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

  // Load applications from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      }
    }
  }, []);
  
  // Check if a job has already been applied to
  const isJobApplied = (jobId: string): boolean => {
    return applications.some(app => app.jobId === jobId);
  };
  
  // Function to handle opening the application modal
  const handleApplyNow = (job: JobMatch) => {
    // Check if already applied
    if (isJobApplied(job.id)) {
      setNotificationMessage('You have already applied for this position.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return;
    }
    
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };
  
  // Function to handle application submission
  const handleSubmitApplication = async (applicationData: JobApplicationData) => {
    try {
      // Here you would typically send the application data to your backend
      console.log('Submitting application:', applicationData);
      
      // Mock API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      if (selectedJob) {
        // Create a new application record
        const newApplication: JobApplication = {
          id: `app-${Date.now()}`,
          jobId: selectedJob.id,
          jobTitle: selectedJob.title,
          company: selectedJob.company,
          appliedDate: new Date().toISOString(),
          status: 'pending',
          applicationData
        };
        
        // Update state and localStorage
        const updatedApplications = [...applications, newApplication];
        setApplications(updatedApplications);
        localStorage.setItem('jobApplications', JSON.stringify(updatedApplications));
      }
      
      // Show success notification
      setNotificationMessage('Application submitted successfully!');
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting application:', error);
      setAnalysisError('Failed to submit application. Please try again.');
      throw error; // Re-throw to be handled by the modal component
    }
  };

  // Function to view application details
  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsViewApplicationModalOpen(true);
  };
  
  // Function to open withdraw confirmation modal
  const handleWithdrawClick = (application: JobApplication, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the view details
    setSelectedApplication(application);
    setIsWithdrawModalOpen(true);
  };
  
  // Function to withdraw an application
  const handleWithdrawApplication = () => {
    if (!selectedApplication) return;
    
    // Filter out the withdrawn application
    const updatedApplications = applications.filter(
      app => app.id !== selectedApplication.id
    );
    
    // Update state and localStorage
    setApplications(updatedApplications);
    localStorage.setItem('jobApplications', JSON.stringify(updatedApplications));
    
    // Show success notification
    setNotificationMessage('Application withdrawn successfully.');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    
    // Close the modal
    setIsWithdrawModalOpen(false);
    setSelectedApplication(null);
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
              <button 
                onClick={() => navigateToTab('applications')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'applications' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Applications
                {applications.length > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    {applications.length}
                  </span>
                )}
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
                        {job.skills?.map((skill, index) => (
                          <span key={index} className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => handleApplyNow(job)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Apply Now
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors">
                          Save
                        </button>
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
            
            {/* Add Applications Preview */}
            {applications.length > 0 && (
              <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-400">Recent Applications</h2>
                  <button 
                    onClick={() => navigateToTab('applications')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {applications.slice(0, 2).map(application => (
                    <div key={application.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-white">{application.jobTitle}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                          application.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                          application.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                          application.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {application.company} • Applied on {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    //@ts-ignore
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
                      {isJobApplied(job.id) ? (
                        <button 
                          className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm cursor-default"
                          disabled
                        >
                          Applied
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApplyNow(job)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Apply Now
                        </button>
                      )}
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
        
        {/* New Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Applications</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Filter by:</span>
                <select className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300">No applications yet</h3>
                <p className="text-gray-500 mt-1">Start applying for jobs to track your applications here</p>
                <button 
                  onClick={() => navigateToTab('matches')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Browse Job Matches
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(application => (
                  <div 
                    key={application.id} 
                    className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleViewApplication(application)}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-blue-400">{application.jobTitle}</h3>
                            <p className="text-gray-400 text-sm">{application.company}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                            application.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                            application.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                            application.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 md:flex-col md:w-32">
                        <button 
                          onClick={() => handleViewApplication(application)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={(e) => handleWithdrawClick(application, e)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Withdraw
                        </button>
                        <button 
                          onClick={() => router.push(`/dashboard/${application.jobId}`)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Take Interview
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      
      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal 
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          job={selectedJob}
          onSubmit={handleSubmitApplication}
        />
      )}
      
      {/* Application Details Modal */}
      {selectedApplication && isViewApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Application Details</h2>
                <button 
                  onClick={() => setIsViewApplicationModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-blue-400">{selectedApplication.jobTitle}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedApplication.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                    selectedApplication.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                    selectedApplication.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                    selectedApplication.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{selectedApplication.company}</p>
                <p className="text-gray-300 text-sm mt-2">
                  Applied on {new Date(selectedApplication.appliedDate).toLocaleDateString()} at {new Date(selectedApplication.appliedDate).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-md font-medium text-white mb-3">Application Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        GitHub Profile
                      </label>
                      <div className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                        <a 
                          href={selectedApplication.applicationData.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {selectedApplication.applicationData.github}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        LinkedIn Profile
                      </label>
                      <div className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                        <a 
                          href={selectedApplication.applicationData.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {selectedApplication.applicationData.linkedin}
                        </a>
                      </div>
                    </div>
                    
                    {selectedApplication.applicationData.coverLetter && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Cover Letter
                        </label>
                        <div className="bg-gray-700 border border-gray-600 rounded-md p-3 text-white">
                          {selectedApplication.applicationData.coverLetter}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-md font-medium text-white mb-3">Question Responses</h4>
                      
                      {Object.entries(selectedApplication.applicationData.answers).map(([questionId, answer]) => (
                        <div key={questionId} className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {questionId === 'experience' ? 'Experience' : 
                             questionId === 'blockchain' ? 'Blockchain Experience' :
                             questionId === 'ai' ? 'AI/ML Experience' :
                             questionId === 'web3' ? 'Web3 Interest' :
                             questionId === 'technical' ? 'Learning Approach' :
                             questionId === 'product' ? 'Product Process' :
                             questionId === 'why' ? 'Interest in Position' : 
                             questionId}
                          </label>
                          <div className="bg-gray-700 border border-gray-600 rounded-md p-3 text-white">
                            {answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-700 mt-6">
                <button
                  onClick={() => setIsViewApplicationModalOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    setIsViewApplicationModalOpen(false);
                    handleWithdrawClick(selectedApplication, e);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                >
                  Withdraw Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdraw Confirmation Modal */}
      {selectedApplication && isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Withdraw Application</h2>
                <button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300">
                  Are you sure you want to withdraw your application for <span className="text-blue-400 font-medium">{selectedApplication.jobTitle}</span> at <span className="text-blue-400 font-medium">{selectedApplication.company}</span>?
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This action cannot be undone. You will need to apply again if you change your mind.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawApplication}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Suspense>
  );
}
