// ResourcesPage.tsx
"use client"
import React, { useState, useEffect } from 'react';
import SuggestResourceModal from './SuggestResource';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string
  url: string;
  provider: string;
  featured: boolean;
  popularity: number;
}

interface ResourcesPageProps {
  eventId: string;
  userId: string;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ eventId, userId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Simulated data - in a real app this would come from an API
  useEffect(() => {
    // Mock data fetch
    setTimeout(() => {
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'TensorFlow: Comprehensive AI Development Framework',
          description: 'An open-source platform developed by Google for building and deploying machine learning models. TensorFlow supports various tasks, including deep learning and neural network training.',
          category: 'Framework',
          url: 'https://www.tensorflow.org/',
          provider: 'Google',
          featured: true,
          popularity: 95
        },
        {
          id: '2',
          title: 'Ethereum: Decentralized Platform for Smart Contracts',
          description: 'A blockchain-based platform that enables developers to build and deploy smart contracts and decentralized applications (dApps).',
          category: 'Blockchain Platform',
          url: 'https://ethereum.org/',
          provider: 'Ethereum Foundation',
          featured: true,
          popularity: 90
        },
        {
          id: '3',
          title: 'Solana: High-Performance Blockchain for Decentralized Apps',
          description: 'A fast and secure blockchain platform designed for decentralized applications and crypto-assets at scale.',
          category: 'Blockchain Platform',
          url: 'https://solana.com/',
          provider: 'Solana Labs',
          featured: false,
          popularity: 88
        },
        {
          id: '4',
          title: 'OpenSea: NFT Marketplace',
          description: 'A leading marketplace for non-fungible tokens (NFTs), allowing users to buy, sell, and discover exclusive digital assets.',
          category: 'Marketplace',
          url: 'https://opensea.io/',
          provider: 'OpenSea',
          featured: false,
          popularity: 85
        },
        {
          id: '5',
          title: 'GitHub: Code Hosting Platform',
          description: 'A platform for version control and collaboration, allowing developers to host and manage code, as well as track and control changes.',
          category: 'Development Platform',
          url: 'https://github.com/',
          provider: 'GitHub',
          featured: true,
          popularity: 92
        },
        {
          id: '6',
          title: 'ConsenSys: Blockchain Technology Company',
          description: 'A blockchain technology company building decentralized applications and developer tools for Ethereum.',
          category: 'Blockchain Development',
          url: 'https://consensys.net/',
          provider: 'ConsenSys',
          featured: false,
          popularity: 85
        },
        {
          id: '7',
          title: 'SonarQube: Continuous Code Quality',
          description: 'An open-source platform for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs and code smells.',
          category: 'Code Quality Tool',
          url: 'https://www.sonarqube.org/',
          provider: 'SonarSource',
          featured: false,
          popularity: 75
        },
        {
          id: '8',
          title: 'Hugging Face: Natural Language Processing Tools',
          description: 'A platform providing tools and models for natural language processing (NLP), including transformers and tokenizers.',
          category: 'AI Development Platform',
          url: 'https://huggingface.co/',
          provider: 'Hugging Face',
          featured: true,
          popularity: 89
        }
      ];
      
      setResources(mockResources);
      setFilteredResources(mockResources);
      setIsLoading(false);
    }, 1000);
  }, [eventId]);
  
  // Filter resources based on search and category
  useEffect(() => {
    let result = resources;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(resource => resource.category === selectedCategory);
    }
    
    setFilteredResources(result);
  }, [searchQuery, selectedCategory, resources]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Bookmark a resource (would save to user profile in a real app)
  const bookmarkResource = (resourceId: string) => {
    console.log(`Resource ${resourceId} bookmarked by user ${userId}`);
    // API call would go here
  };
  
  return (
    
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 py-6 border-b border-gray-700">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-purple-400">Hackathon Resources</h1>
          <p className="text-gray-400 mt-2">
            Curated tools, APIs, and guides to boost your hackathon project
          </p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <svg 
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'Documentation', 'API', 'Tools', 'Templates', 'Learning'].map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  ${selectedCategory === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Resources Grid */}
      <div className="container mx-auto px-6 py-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">No resources found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div 
                key={resource.id} 
                className={`bg-gray-800 rounded-lg overflow-hidden border ${
                  resource.featured ? 'border-purple-500' : 'border-gray-700'
                } transition-transform duration-300 hover:transform hover:scale-102 hover:shadow-lg`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 mb-2">
                        {resource.category}
                      </span>
                      {resource.featured && (
                        <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-300 mb-2">
                          Featured
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => bookmarkResource(resource.id)}
                      className="text-gray-500 hover:text-purple-400"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mt-2">{resource.title}</h3>
                  <p className="text-gray-400 mt-2">{resource.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Provided by <span className="text-purple-400">{resource.provider}</span>
                    </span>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 15.585l-7.07 3.735 1.358-7.9L.572 7.02l7.92-1.142L10 0l2.508 5.878 7.92 1.142-5.716 5.4 1.358 7.9z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-400">{resource.popularity}%</span>
                    </div>
                  </div>
                  
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-5 inline-block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition duration-300"
                  >
                    Access Resource
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom CTA */}
      <div className="container mx-auto px-6 py-12">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-white">Missing something?</h3>
            <p className="text-gray-400 mt-2">Suggest a new resource for the hackathon community</p>
          </div>
          <button
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition duration-300"
            onClick={() => setModalOpen(true)}
          >
            Suggest Resource
          </button>
        </div>
      </div>
      {isModalOpen && <SuggestResourceModal onClose={() => setModalOpen(false)} />}
    </div>
     
      
    </div>
  );
};

export default ResourcesPage;