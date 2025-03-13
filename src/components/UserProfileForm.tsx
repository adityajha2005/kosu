"use client";
import { useState, useEffect } from 'react';

// Define the skill options
const SKILL_OPTIONS = [
  "Blockchain Development",
  "Smart Contracts",
  "Solidity",
  "Move",
  "Rust",
  "Web3",
  "DeFi",
  "NFTs",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Product Management",
  "Tokenomics",
  "Cryptography",
  "Security",
  "Technical Writing",
  "Community Management",
  "Marketing",
  "Business Development"
];

// Define the interest options
const INTEREST_OPTIONS = [
  "DeFi",
  "NFTs",
  "Gaming",
  "Metaverse",
  "DAOs",
  "Social Impact",
  "Identity",
  "Privacy",
  "Infrastructure",
  "Layer 2 Solutions",
  "Cross-chain",
  "Governance",
  "Education",
  "Research",
  "Trading",
  "Investment"
];

interface UserProfileFormProps {
  walletAddress: string;
  onProfileUpdate?: () => void;
}

export default function UserProfileForm({ walletAddress, onProfileUpdate }: UserProfileFormProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner');
  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/user/profile?address=${walletAddress}`);
        const data = await response.json();
        
        if (response.ok && data.success && data.user) {
          setName(data.user.name || '');
          setBio(data.user.bio || '');
          setSkills(data.user.skills || []);
          setInterests(data.user.interests || []);
          setExperienceLevel(data.user.experienceLevel || 'Beginner');
          setLookingForTeam(data.user.lookingForTeam || false);
          setIsProfileLoaded(true);
        } else {
          console.warn("Failed to load profile:", data.error);
          setIsProfileLoaded(true);
          
          if (data.error && !data.error.includes("not found")) {
            setError(data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsProfileLoaded(true);
        setError('Failed to load profile. You can still fill out the form below.');
      } finally {
        setIsLoading(false);
      }
    };

    if (walletAddress) {
      fetchUserProfile();
    }
  }, [walletAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          name,
          bio,
          skills,
          interests,
          experienceLevel,
          lookingForTeam
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        setError(data.error || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  if (isLoading && !isProfileLoaded) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Complete Your Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 rounded-lg border border-red-700 text-white">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-900/50 rounded-lg border border-green-700 text-white">
          <p>Profile updated successfully!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself, your experience, and what you're looking for"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  skills.includes(skill)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  interests.includes(interest)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300 mb-1">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Expert')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lookingForTeam"
            checked={lookingForTeam}
            onChange={(e) => setLookingForTeam(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="lookingForTeam" className="ml-2 block text-sm text-gray-300">
            I'm looking for a team for hackathons and projects
          </label>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Profile...
              </span>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 