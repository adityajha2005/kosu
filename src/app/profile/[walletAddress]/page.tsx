"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Briefcase, Code, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';

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

export default function ProfilePage() {
  const params = useParams();
  const walletAddress = params.walletAddress as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/user/profile/${walletAddress}`);
        
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
    
    if (walletAddress) {
      fetchProfile();
    }
  }, [walletAddress]);

  const formatWalletAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
          
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={48} className="text-blue-400 animate-spin mb-4" />
            <p className="text-gray-300">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-gray-300 text-lg mb-2">{error}</p>
            <p className="text-gray-400">The profile you're looking for might not exist or there was an error loading it.</p>
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
                <h2 className="text-xl font-bold text-white mb-1">
                  {profile.name || 'Anonymous User'}
                </h2>
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
                
                {profile.lookingForTeam && (
                  <div className="bg-green-900/30 border border-green-800 rounded-md p-3 text-green-300 text-sm">
                    Looking for a team
                  </div>
                )}
              </div>
            </div>
            
            {/* Skills & Interests */}
            <div className="md:col-span-2 space-y-6">
              {/* Skills */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Code className="mr-2 text-blue-400" />
                  Skills
                </h3>
                
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
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Briefcase className="mr-2 text-blue-400" />
                  Interests
                </h3>
                
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
              
              {/* Contact Button */}
              <div className="flex justify-center md:justify-start">
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Contact User
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-300 text-lg">User not found</p>
          </div>
        )}
      </div>
    </div>
  );
} 