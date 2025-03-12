"use client";
// FeaturesPage.tsx
import React, { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'AI' | 'Blockchain' | 'Automation' | 'Engagement' | 'Hiring';
  iconName: string;
  isNew: boolean;
  comingSoon: boolean;
}

interface FeaturesPageProps {
  eventId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeaturesPage: React.FC<FeaturesPageProps> = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  
  // Feature data
  const features: Feature[] = [
    {
      id: '1',
      title: 'One-Click Event Setup',
      description: 'Create customizable landing pages for your hackathon in minutes with our intuitive event builder.',
      category: 'Automation',
      iconName: 'rocket',
      isNew: false,
      comingSoon: false
    },
    {
      id: '2',
      title: 'AI-Powered Team Matching',
      description: 'Our advanced algorithm matches participants based on skills, interests, and location to form optimal teams.',
      category: 'AI',
      iconName: 'users',
      isNew: false,
      comingSoon: false
    },
    {
      id: '3',
      title: 'NFT-Based Event Swags',
      description: 'Distribute digital collectibles as entry tickets, participation badges, and achievement rewards.',
      category: 'Blockchain',
      iconName: 'award',
      isNew: true,
      comingSoon: false
    },
    {
      id: '4',
      title: 'Dynamic Problem Statements',
      description: 'Generate tailored challenges based on sponsor requirements and industry trends.',
      category: 'AI',
      iconName: 'lightbulb',
      isNew: false,
      comingSoon: false
    },
    {
      id: '5',
      title: 'Automated Code Evaluation',
      description: 'AI-powered system analyzes code quality, complexity, and efficiency before final human judging.',
      category: 'AI',
      iconName: 'code',
      isNew: true,
      comingSoon: false
    },
    {
      id: '6',
      title: 'Smart Talent Acquisition',
      description: 'Filter and identify ideal candidates using OCEAN personality traits matched with technical skills.',
      category: 'Hiring',
      iconName: 'briefcase',
      isNew: false,
      comingSoon: false
    },
    {
      id: '7',
      title: 'Real-time Engagement Dashboard',
      description: 'Track participant interaction, submission progress, and overall event metrics in real-time.',
      category: 'Engagement',
      iconName: 'activity',
      isNew: false,
      comingSoon: false
    },
    {
      id: '8',
      title: 'Token-Based Incentives',
      description: 'Reward participation, collaboration, and achievements with blockchain tokens redeemable for prizes.',
      category: 'Blockchain',
      iconName: 'gift',
      isNew: false,
      comingSoon: false
    },
    {
      id: '9',
      title: 'Personalized Learning Paths',
      description: 'AI recommends resources and workshops based on participant skill levels and project goals.',
      category: 'AI',
      iconName: 'map',
      isNew: false,
      comingSoon: true
    },
    {
      id: '10',
      title: 'Decentralized Voting System',
      description: 'Fair and transparent judging process powered by blockchain technology.',
      category: 'Blockchain',
      iconName: 'check-square',
      isNew: false,
      comingSoon: true
    }
  ];
  
  // Filter features based on active tab
  const filteredFeatures = activeTab === 'All' 
    ? features 
    : features.filter(feature => feature.category === activeTab);
  
  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    // In a real application, you would import actual icons
    // This is a placeholder to demonstrate the concept
    return (
      <div className="h-12 w-12 rounded-full bg-purple-900 flex items-center justify-center text-purple-300">
        {iconName === 'rocket' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        )}
        
        {iconName === 'users' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        
        {iconName === 'award' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )}
        
        {iconName === 'lightbulb' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )}
        
        {iconName === 'code' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )}
        
        {iconName === 'briefcase' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
        
        {iconName === 'activity' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )}
        
        {iconName === 'gift' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112.83 2.83l-2.83 2.83a2 2 0 01-2.83-2.83L12 6.5V2.34l2.06 1.03a5.91 5.91 0 012.02 1.49 6.59 6.59 0 012.5 4.57h.5A2.25 2.25 0 0121 11v2a2.25 2.25 0 01-2.25 2.25h-9.5A2.25 2.25 0 017 13v-2c0-1.06.74-1.95 1.74-2.18A6.55 6.55 0 0111.23 4.2a6.23 6.23 0 012.04-1.24l1.87-.93 1.16 2.32c.46.92.7 1.95.7 2.99 0 3.31-2.69 6-6 6m10 0v5a2 2 0 01-2 2h-1v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1H6a2 2 0 01-2-2v-5" />
          </svg>
        )}
        
        {iconName === 'map' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        )}
        
        {iconName === 'check-square' && (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gray-800 border-b border-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Revolutionize Your <span className="text-purple-400">Hackathon Experience</span>
          </h1>
          <p className="text-xl text-gray-300 mt-4 max-w-2xl">
            Our AI-powered platform combined with blockchain technology makes organizing, participating, and hiring through hackathons more efficient, engaging, and fair.
          </p>
          <div className="mt-8">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-lg">
              Get Started Free
            </button>
            <button className="ml-4 px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
      
      {/* Feature Categories */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-white">Platform Features</h2>
          <p className="text-gray-400 mt-2 text-center max-w-xl">
            Discover how our innovative features can transform your hackathon experience
          </p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {['All', 'AI', 'Blockchain', 'Automation', 'Engagement', 'Hiring'].map(tab => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition duration-300
                ${activeTab === tab 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatures.map(feature => (
            <div 
              key={feature.id} 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                {renderIcon(feature.iconName)}
                <div className="flex">
                  {feature.isNew && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                      New
                    </span>
                  )}
                  {feature.comingSoon && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300 ml-2">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mt-4">{feature.title}</h3>
              <p className="text-gray-400 mt-2 min-h-16">{feature.description}</p>
              
              <div className="mt-6 flex items-center">
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                  {feature.category}
                </span>
                <button className="ml-auto text-purple-400 hover:text-purple-300 text-sm font-medium transition duration-300 flex items-center">
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feature Highlight Section */}
      <div className="bg-gray-800 border-t border-b border-gray-700 py-16 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h2 className="text-3xl font-bold text-white">AI-Powered <span className="text-purple-400">Team Matching</span></h2>
              <p className="text-gray-400 mt-4">
                Our advanced algorithms analyze participants skills, experience, location, and interests to create the most effective teams for your hackathon. This ensures balanced skill distribution and maximizes creative potential.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Personality trait matching using OCEAN model</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Skill gap identification and complementary pairing</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Historical performance analysis for optimal grouping</span>
                </li>
              </ul>
              <button className="mt-8 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-300">
                See How It Works
              </button>
            </div>
            <div className="lg:w-1/2 bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              <div className="aspect-w-16 aspect-h-9 bg-gray-900 flex items-center justify-center p-8">
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <img 
                    src="/visualization.png" 
                    alt="Visualization" 
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <svg className="h-8 w-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            
            <blockquote className="text-xl text-gray-300 italic max-w-4xl">
            {/*  eslint-disable-next-line react/no-unescaped-entities */}
              "Implementing this platform for our university hackathon increased participant satisfaction by 78% and resulted in 12 successful hiring placements. The AI team matching and blockchain-based rewards created an engaging experience unlike any other event we've hosted."
            </blockquote>
            <div className="mt-6">
              <h4 className="text-white font-medium">Sarah Johnson</h4>
              <p className="text-gray-500 text-sm">Director of Innovation, TechUniversity</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-white">Ready to transform your hackathon?</h2>
              <p className="text-purple-200 mt-2">
                Join thousands of organizers revolutionizing the hackathon experience.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-purple-900 font-medium rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg">
                Start Free Trial
              </button>
              <button className="px-6 py-3 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white/10 transition duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © 2025 HackPro Platform • Powered by AI and Blockchain
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition duration-300">Terms</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition duration-300">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition duration-300">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;