"use client";
// FeaturesPage.tsx with Modal Implementation
import React, { useState } from 'react';


interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'AI' | 'Blockchain' | 'Automation' | 'Engagement' | 'Hiring';
  iconName: string;
  isNew: boolean;
  comingSoon: boolean;
  detailedDescription?: string;
  benefits?: string[];
  useCase?: string;
}

interface FeaturesPageProps {
  eventId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeaturesPage: React.FC<FeaturesPageProps> = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  // Feature data with added detailed descriptions
  const features: Feature[] = [
    {
      id: '1',
      title: 'One-Click Event Setup',
      description: 'Create customizable landing pages for your hackathon in minutes with our intuitive event builder.',
      category: 'Automation',
      iconName: 'rocket',
      isNew: false,
      comingSoon: false,
      detailedDescription: 'Our One-Click Event Setup streamlines the entire process of creating a hackathon event. With an intuitive drag-and-drop interface, organizers can quickly design landing pages, registration forms, and schedules without any coding knowledge. The platform offers customizable templates tailored to different hackathon types, from corporate innovation challenges to educational coding competitions.',
      benefits: [
        'Reduces setup time by 75% compared to traditional methods',
        'Includes SEO optimization for better event discoverability',
        'Supports multiple payment gateway integrations for paid events',
        'Automatically generates responsive designs for all devices'
      ],
      useCase: 'TechUniversity used our One-Click Setup to launch their annual hackathon in just 2 hours instead of the 2 weeks it took them previously. The streamlined process allowed them to focus on participant engagement rather than technical logistics.'
    },
    {
      id: '2',
      title: 'AI-Powered Team Matching',
      description: 'Our advanced algorithm matches participants based on skills, interests, and location to form optimal teams.',
      category: 'AI',
      iconName: 'users',
      isNew: false,
      comingSoon: false,
      detailedDescription: 'The AI-Powered Team Matching system uses machine learning algorithms trained on thousands of successful hackathon teams to create optimal groupings. It analyzes participants technical skills, personality traits, past project experiences, learning goals, and even time zone compatibility to suggest ideal team compositions. Participants can set preferences for team size, required skills, and working styles.',
      benefits: [
        'Reduces team conflicts by 63% through personality compatibility analysis',
        'Ensures balanced skill distribution across all participating teams',
        'Integrates with LinkedIn and GitHub profiles for accurate skill assessment',
        'Provides diversity and inclusion metrics to ensure balanced representation'
      ],
      useCase: 'InnovateX Corporation implemented our team matching for their 500-person hackathon and saw a 47% increase in completed projects compared to their previous manual team formation process.'
    },
    {
      id: '3',
      title: 'NFT-Based Event Swags',
      description: 'Distribute digital collectibles as entry tickets, participation badges, and achievement rewards.',
      category: 'Blockchain',
      iconName: 'award',
      isNew: true,
      comingSoon: false,
      detailedDescription: 'Our NFT-Based Event Swags system transforms traditional hackathon memorabilia into valuable digital assets. Each NFT is uniquely designed for your event with different tiers for participants, finalists, winners, and mentors. These digital collectibles serve as verifiable proof of participation and achievement that participants can showcase in their digital portfolios. The platform supports multiple blockchain networks with minimal gas fees.',
      benefits: [
        'Creates lasting value beyond physical swag with tradable digital assets',
        'Provides verifiable credentials that participants can add to professional profiles',
        'Reduces environmental impact by eliminating shipping and physical production',
        'Enables dynamic NFTs that evolve based on continued participation in future events'
      ],
      useCase: 'GreenTech Hackathon replaced their physical t-shirts and stickers with custom NFTs, saving $12,000 in production and shipping costs while providing participants with digital assets that appreciated 300% in value within 6 months.'
    },
    {
      id: '4',
      title: 'Dynamic Problem Statements',
      description: 'Generate tailored challenges based on sponsor requirements and industry trends.',
      category: 'AI',
      iconName: 'lightbulb',
      isNew: false,
      comingSoon: false,
      detailedDescription: 'The Dynamic Problem Statements feature uses natural language processing and trend analysis to help sponsors create compelling, relevant challenges. By analyzing current industry pain points, emerging technologies, and past successful hackathon projects, the system suggests optimized problem statements that balance creativity, feasibility, and business impact. Sponsors can set parameters including technical complexity, required outputs, and evaluation criteria.',
      benefits: [
        'Increases solution quality by 43% through well-structured problem framing',
        'Helps sponsors align hackathon challenges with actual business needs',
        'Suggests optimal scope and constraints to make challenges hackable in the timeframe',
        'Recommends technologies and resources participants might need'
      ],
      useCase: 'FinTech Alliance used our Dynamic Problem Statements to generate 12 unique challenges for their open banking hackathon, resulting in 8 prototypes that advanced to their accelerator program.'
    },
    {
      id: '5',
      title: 'Automated Code Evaluation',
      description: 'AI-powered system analyzes code quality, complexity, and efficiency before final human judging.',
      category: 'AI',
      iconName: 'code',
      isNew: true,
      comingSoon: false,
      detailedDescription: 'Our Automated Code Evaluation system performs comprehensive analysis of submitted projects to provide objective metrics for judges and valuable feedback for participants. The engine checks code quality, test coverage, security vulnerabilities, performance optimization, and architectural decisions. It automatically deploys and tests solutions in a sandbox environment to verify functionality and scalability. This creates a baseline technical assessment before human judges evaluate innovation and business potential.',
      benefits: [
        'Saves judges 65% of evaluation time through automated technical assessment',
        'Provides consistent, objective evaluation across all submissions',
        'Gives participants immediate feedback to improve their projects even during the hackathon',
        'Detects code plagiarism and ensures original work is properly recognized'
      ],
      useCase: 'CyberSec Hackathon utilized our evaluation system to automatically test 178 security solution submissions against a standardized vulnerability dataset, allowing judges to focus only on the top 20 performing solutions.'
    },
    {
      id: '6',
      title: 'Smart Talent Acquisition',
      description: 'Filter and identify ideal candidates using OCEAN personality traits matched with technical skills.',
      category: 'Hiring',
      iconName: 'briefcase',
      isNew: false,
      comingSoon: false,
      detailedDescription: 'Smart Talent Acquisition transforms hackathons into efficient recruitment channels by providing sponsors and companies with detailed participant insights. The system combines OCEAN personality profiling (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) with technical skill assessment and real-time project contributions to identify candidates that match specific team needs. Recruiters can set filters for required skills, personality traits that complement existing teams, and performance metrics to find ideal matches.',
      benefits: [
        'Reduces hiring costs by 52% compared to traditional recruitment channels',
        'Increases new hire retention by matching company culture with personality profiles',
        'Provides video highlights of candidates solving problems in real-time',
        'Offers behavioral analysis beyond what interviews can reveal'
      ],
      useCase: 'TechGiant recruited 32 engineers from our platform in one quarter, reporting that these hires reached productivity 40% faster than candidates from traditional sources due to better team fit.'
    },
    {
      id: '7',
      title: 'Real-time Engagement Dashboard',
      description: 'Track participant interaction, submission progress, and overall event metrics in real-time.',
      category: 'Engagement',
      iconName: 'activity',
      isNew: false,
      comingSoon: false,
      detailedDescription: 'The Real-time Engagement Dashboard provides organizers with comprehensive analytics throughout the hackathon lifecycle. The interactive visualization tool tracks registration trends, team formation progress, mentor interactions, workshop attendance, code commits, and submission status. The system identifies potential bottlenecks or engagement drops and suggests interventions based on successful patterns from previous events. A public-facing version can be displayed to create excitement around hackathon activity.',
      benefits: [
        'Enables proactive intervention when teams are struggling or disengaging',
        'Provides sponsors with transparent ROI metrics throughout the event',
        'Gamifies participation with real-time leaderboards and achievement tracking',
        'Generates post-event reports with actionable insights for future improvements'
      ],
      useCase: 'Global Hack used our dashboard to monitor 5,000 participants across 12 time zones, identifying and resolving technical issues within minutes and achieving 94% participant satisfaction.'
    },
    {
      id: '8',
      title: 'Token-Based Incentives',
      description: 'Reward participation, collaboration, and achievements with blockchain tokens redeemable for prizes.',
      category: 'Blockchain',
      iconName: 'gift',
      isNew: false,
      comingSoon: false,
      detailedDescription: 'The Token-Based Incentives system creates a gamified economy within your hackathon. Participants earn tokens for valuable contributions including helping others, completing challenges, providing quality feedback, attending workshops, and reaching project milestones. The earned tokens can be redeemed for rewards ranging from premium API access to mentorship sessions with industry experts. All transactions are recorded on-chain, creating transparent incentive structures.',
      benefits: [
        'Increases participant engagement by 78% through continuous reinforcement',
        'Creates more collaborative atmosphere compared to winner-takes-all prizes',
        'Allows sponsors to direct participant effort toward specific challenges',
        'Provides ongoing incentives throughout the event, not just final judging'
      ],
      useCase: 'EdTech Hackathon implemented token rewards for peer mentoring, resulting in 340% more cross-team collaboration than in previous years and higher quality solutions overall.'
    },
    {
      id: '9',
      title: 'Personalized Learning Paths',
      description: 'AI recommends resources and workshops based on participant skill levels and project goals.',
      category: 'AI',
      iconName: 'map',
      isNew: false,
      comingSoon: true,
      detailedDescription: 'Coming Soon: Personalized Learning Paths will transform hackathons into powerful upskilling experiences. The AI system assesses each participant`s current skills through pre-event surveys and integration with learning platforms. Based on their hackathon project goals and skill gaps, it creates customized learning recommendations including workshops to attend, documentation to review, and practice exercises. Progress tracking helps participants see their growth throughout the event.',
      benefits: [
        'Transforms hackathons from competitions into educational experiences',
        'Provides valuable skills development even for non-winning participants',
        'Helps sponsors showcase their technologies through guided learning',
        'Creates long-term engagement through post-event learning continuations'
      ],
      useCase: 'This feature is currently in development with beta testing scheduled to begin next quarter. Early access can be requested through your account manager.'
    },
    {
      id: '10',
      title: 'Decentralized Voting System',
      description: 'Fair and transparent judging process powered by blockchain technology.',
      category: 'Blockchain',
      iconName: 'check-square',
      isNew: false,
      comingSoon: true,
      detailedDescription: 'Coming Soon: Our Decentralized Voting System will eliminate bias and ensure complete transparency in the hackathon judging process. All votes are recorded on a public blockchain with judges identities optionally anonymized. The system uses a quadratic voting mechanism where judges allocate points across multiple evaluation criteria. Smart contracts automatically tally results and can integrate with token distribution for prize awards. The entire voting process is auditable by all participants.',
      benefits: [
        'Eliminates perception of favoritism through transparent voting records',
        'Prevents vote manipulation through decentralized verification',
        'Allows weighted criteria importance based on sponsor priorities',
        'Supports multiple voting formats including public choice and expert panels'
      ],
      useCase: 'This feature is in final development with security audits underway. Join our waiting list to be among the first organizers to implement this revolutionary judging system.'
    }
  ];
  
  // Filter features based on active tab
  const filteredFeatures = activeTab === 'All' 
    ? features 
    : features.filter(feature => feature.category === activeTab);
  
  // Open modal with selected feature
  const openFeatureModal = (feature: Feature) => {
    setSelectedFeature(feature);
    setModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFeature(null);
  };
  
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
                <button 
                  onClick={() => openFeatureModal(feature)}
                  className="ml-auto text-purple-400 hover:text-purple-300 text-sm font-medium transition duration-300 flex items-center"
                >
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
      
      {/* Feature Modal */}
      {modalOpen && selectedFeature && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-xl">
            <div className="p-6 relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center">
                {renderIcon(selectedFeature.iconName)}
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-white">{selectedFeature.title}</h3>
                  <div className="flex mt-1">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      {selectedFeature.category}
                    </span>
                    {selectedFeature.isNew && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-900 text-green-300 ml-2">
                        New
                      </span>
                    )}
                    {selectedFeature.comingSoon && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300 ml-2">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-white">Overview</h4>
                  <p className="text-gray-300 mt-2">{selectedFeature.detailedDescription}</p>
                </div>
                
                {selectedFeature.benefits && selectedFeature.benefits.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-white">Key Benefits</h4>
                    <ul className="mt-2 space-y-2">
                      {selectedFeature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedFeature.useCase && (
                  <div>
                    <h4 className="text-xl font-semibold text-white">Success Story</h4>
                    <div className="mt-2 bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-300 italic">{selectedFeature.useCase}</p>
                    </div>
                  </div>
                )}
              </div>
              
             
            </div>
          </div>
        </div>
      )}
      
      {/* Feature Highlight Section */}
      <div className="bg-gray-800 border-t border-b border-gray-700 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-white">Powered by AI & Blockchain</h2>
              <p className="text-gray-300 mt-4">
                Our platform leverages cutting-edge AI to match participants with the perfect projects and teams, while blockchain technology ensures transparent judging and secure credential verification.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Smart matching algorithms for team formation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Immutable judging records on blockchain</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Automated credential verification</span>
                </li>
              </ul>
              <button className="mt-8 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-300 flex items-center">
                Explore Technology
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="lg:w-1/2 lg:pl-16">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold">1</div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Register & Create Profile</h4>
                      <p className="text-gray-400 mt-1">Create your profile with skills, interests, and experience level</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold">2</div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">AI-Powered Matching</h4>
                      <p className="text-gray-400 mt-1">Our AI suggests optimal teams and projects based on your profile</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold">3</div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Transparent Judging</h4>
                      <p className="text-gray-400 mt-1">Blockchain ensures fair, transparent evaluation of projects</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold">4</div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Verifiable Achievements</h4>
                      <p className="text-gray-400 mt-1">Earn blockchain-verified credentials for your portfolio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-white">Success Stories</h2>
          <p className="text-gray-400 mt-2 text-center max-w-xl">
            Hear from hackathon organizers, participants, and recruiters who have transformed their experience with our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-xl">JD</div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">Jane Doe</h4>
                <p className="text-gray-400 text-sm">Hackathon Organizer</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "The AI-powered matching system saved us countless hours of manual team formation. We saw a 40% increase in participant satisfaction and higher quality projects."
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-xl">MS</div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">Mike Smith</h4>
                <p className="text-gray-400 text-sm">Student Participant</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "As a first-time hackathon participant, I was nervous about finding a team. The platform matched me with the perfect teammates, and we ended up winning second place!"
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xl">AR</div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">Alice Rodriguez</h4>
                <p className="text-gray-400 text-sm">Tech Recruiter</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "The verified credentials make our hiring process so much easier. We can quickly identify top talent based on their hackathon performance and contributions."
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-t border-purple-800">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-white">Ready to Transform Your Hackathon Experience?</h2>
              <p className="text-gray-200 mt-4 max-w-2xl">
                Join thousands of organizers, participants, and recruiters who are already experiencing the future of hackathons.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
};


export default FeaturesPage