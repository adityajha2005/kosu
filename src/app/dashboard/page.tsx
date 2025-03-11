"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userAddress = localStorage.getItem('userWalletAddress');
    if (!userAddress) {
      router.push('/');
      return;
    }
    
    setAddress(userAddress);
  }, [router]);

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
        <p className="text-gray-400 mb-8">Redefining hiring in Web3 and AI-native industries</p>
        
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
            <p className="text-gray-400 mb-4">AI-powered skill and personality assessment to match you with ideal roles.</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
              Start Assessment
            </button>
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
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
              Launch Agent
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Job Matches</h2>
            <div className="space-y-4">
              <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-blue-400">Senior Blockchain Developer</h3>
                    <p className="text-gray-400 text-sm">Aptos Labs • Remote</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    92% Match
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">Based on your AI assessment, you&apos;re an excellent match for this position.</p>
              </div>
              
              <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-blue-400">AI Integration Specialist</h3>
                    <p className="text-gray-400 text-sm">MOVE AI • San Francisco</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    87% Match
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">Your skills in machine learning and blockchain are a strong fit for this role.</p>
              </div>
              
              <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-blue-400">Web3 Product Manager</h3>
                    <p className="text-gray-400 text-sm">Decentralized Systems • Singapore</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    78% Match
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">Your leadership skills and technical background make you a good candidate.</p>
              </div>
            </div>
            <button className="w-full mt-4 border border-gray-600 text-gray-400 hover:bg-gray-700 py-2 rounded-lg transition-colors">
              View All Matches
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Platform Benefits</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Trustless & Transparent Hiring</h3>
                  <p className="text-gray-400 text-sm">Aptos-powered credentialing eliminates fraud and ensures verification of your qualifications.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">AI-Driven Accuracy</h3>
                  <p className="text-gray-400 text-sm">MOVE AI enhances candidate-job matching through intelligent evaluation of your skills and experience.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Efficiency & Speed</h3>
                  <p className="text-gray-400 text-sm">Automated hiring processes reduce recruitment time and enhance your candidate experience.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <h3 className="font-medium text-white mb-2">Get Started Today</h3>
              <p className="text-gray-300 text-sm mb-3">Complete your profile and AI assessment to unlock personalized job matches.</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-colors">
                Complete Your Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
