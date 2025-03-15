"use client"
// @ts-nocheck;
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, Code, ArrowLeft, Loader2, AlertCircle, Edit } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  _id: string;
  walletAddress: string;
  name?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  experienceLevel?: string;
  lookingForTeam?: boolean;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedAddress = localStorage.getItem('userWalletAddress');
          if (storedAddress) {
            setUserAddress(storedAddress);
          } else {
            router.push('/events');
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };
    
    checkConnection();
  }, [router]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userAddress) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/user/profile/${userAddress}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        setProfile(data.user);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userAddress) {
      fetchProfile();
    }
  }, [userAddress]);

  const formatWalletAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleLookingForTeam = async () => {
    if (!profile) return;
    
    try {
      const response = await fetch('/api/user/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: userAddress,
          lookingForTeam: !profile.lookingForTeam,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setProfile({
        ...profile,
        lookingForTeam: !profile.lookingForTeam,
      });
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <Link 
            href="/events" 
            className="inline-flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Hackathons
          </Link>
          
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={48} className="text-blue-400 animate-spin mb-4" />
            <p className="text-gray-300">Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-gray-300 text-lg mb-2">{error}</p>
            <p className="text-gray-400">There was an error loading your profile.</p>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-800 overflow-hidden flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              </div>
              
              <div className="p-6 text-center">
                <div className="flex justify-center items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white">
                    {profile.name || 'Anonymous User'}
                  </h2>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white">
                    <Edit size={16} />
                  </Link>
                </div>
                <p className="text-gray-400 mb-4">
                  {formatWalletAddress(profile.walletAddress)}
                </p>
                
                {profile.experienceLevel && (
                  <div className="inline-block bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm mb-4">
                    {profile.experienceLevel}
                  </div>
                )}
                
                {profile.bio && (
                  <p className="text-gray-300 mb-6">
                    {profile.bio}
                  </p>
                )}
                
                <button
                  onClick={toggleLookingForTeam}
                  className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    profile.lookingForTeam
                      ? 'bg-green-900/30 border border-green-800 text-green-300 hover:bg-green-900/50'
                      : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {profile.lookingForTeam ? 'Looking for Team ✓' : 'Not Looking for Team'}
                </button>
              </div>
            </div>
            
            {/* Skills & Interests */}
            <div className="md:col-span-2 space-y-6">
              {/* Skills */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Code className="mr-2 text-blue-400" />
                    Skills
                  </h3>
                  <Link href="/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
                    Edit Skills
                  </Link>
                </div>
                
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No skills listed</p>
                )}
              </div>
              
              {/* Interests */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Briefcase className="mr-2 text-blue-400" />
                    Interests
                  </h3>
                  <Link href="/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
                    Edit Interests
                  </Link>
                </div>
                
                {profile.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No interests listed</p>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center"
                >
                  Edit Profile
                </Link>
                <Link 
                  href="/events"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  Find Hackathons
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-300 text-lg">Profile not found</p>
          </div>
        )}
      </div>
    </div>
  );
} 