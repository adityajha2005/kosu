"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfileCardProps {
  walletAddress: string;
  onEditProfile?: () => void;
}

interface UserProfile {
  walletAddress: string;
  name?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  lookingForTeam?: boolean;
}

export default function UserProfileCard({ walletAddress, onEditProfile }: UserProfileCardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/user/profile?address=${walletAddress}`);
        const data = await response.json();
        
        if (response.ok && data.success && data.user) {
          setProfile(data.user);
        } else {

          if (data.error && !data.error.includes("not found")) {
            setError(data.error || 'Failed to load profile');
          } else {
            setProfile({ walletAddress });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (walletAddress) {
      fetchUserProfile();
    }
  }, [walletAddress]);

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      router.push('/dashboard?tab=profile');
    }
  };

  // Shorten wallet address for display
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="p-3 bg-red-900/50 rounded-lg border border-red-700 text-white mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={handleEditProfile}
          className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile || (!profile.name && !profile.bio && (!profile.skills || profile.skills.length === 0))) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-400 mb-2">Complete Your Profile</h2>
        <p className="text-gray-300 text-sm mb-4">
          {profile ? 
            `Welcome! We've connected your wallet (${shortenAddress(profile.walletAddress)}). Complete your profile to help us match you with the best opportunities and teams.` :
            "Your profile is incomplete. Complete your profile to help us match you with the best opportunities and teams."
          }
        </p>
        <button
          onClick={handleEditProfile}
          className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-blue-400">Your Profile</h2>
        <button
          onClick={handleEditProfile}
          className="text-sm px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
        >
          Edit Profile
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{profile.name || 'Anonymous'}</h3>
            <p className="text-gray-400 text-sm">{shortenAddress(profile.walletAddress)}</p>
          </div>
        </div>
        
        {profile.experienceLevel && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Experience:</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              profile.experienceLevel === 'Expert' ? 'bg-purple-500/20 text-purple-400' : 
              profile.experienceLevel === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {profile.experienceLevel}
            </span>
          </div>
        )}
        
        {profile.lookingForTeam && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-2 text-sm text-blue-300">
            Looking for a team for hackathons and projects
          </div>
        )}
        
        {profile.bio && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-1">Bio</h4>
            <p className="text-gray-400 text-sm">{profile.bio}</p>
          </div>
        )}
        
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span key={index} className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 