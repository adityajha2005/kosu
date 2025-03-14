"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Loader2, User, Code, Briefcase, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Teammate {
  id: string;
  name: string;
  skills: string[];
  experience: string;
  bio: string;
  walletAddress: string;
  similarityScore: number;
}

interface FindTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSkills: string[];
  userId: string;
}

export default function FindTeammatesModal({ isOpen, onClose, userSkills, userId }: FindTeammatesModalProps) {
  const router = useRouter();
  const [experience, setExperience] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills || []);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSkills(userSkills || []);
      setExperience('');
      setTeammates([]);
      setError(null);
      setShowResults(false);
    }
  }, [isOpen, userSkills]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const viewProfile = (walletAddress: string) => {
    onClose(); 
    
    if (walletAddress === userId) {
      router.push('/profile');
    } else {
      router.push(`/profile/${walletAddress}`);
    }
  };

  const findTeammates = async () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/find-teammates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: selectedSkills,
          experience,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find teammates');
      }

      const data = await response.json();
      setTeammates(data.matches);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while finding teammates');
    } finally {
      setIsSearching(false);
    }
  };

  const skillCategories = {
    'Blockchain': ['Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'Ethereum', 'DeFi', 'NFT', 'Cryptocurrency'],
    'Programming': ['JavaScript', 'Python', 'React', 'TypeScript', 'Node.js', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Golang', 'Rust'],
    'AI/ML': ['Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Data Science', 'NLP', 'Computer Vision'],
    'Frontend': ['React', 'Angular', 'Vue', 'HTML', 'CSS', 'SCSS', 'Sass', 'TailwindCSS', 'Bootstrap'],
    'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'FastAPI'],
    'DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions'],
    'Databases': ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB', 'Cassandra', 'Elasticsearch'],
    'Other': ['Product Management', 'Leadership', 'Communication', 'Agile', 'Scrum', 'Project Management', 'Team Management']
  };

  const formatSimilarity = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="text-blue-400" />
            Find Teammates
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!showResults ? (
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Find potential teammates based on skill compatibility and experience. Our AI will match you with the most compatible people for your hackathon team.
              </p>

              {/* Skills selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Select Skills (Required)</h3>
                <div className="space-y-4">
                  {Object.entries(skillCategories).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-400 mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`text-sm px-3 py-1 rounded-full transition-colors ${
                              selectedSkills.includes(skill)
                                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                : 'bg-gray-700 text-gray-400 border border-gray-600'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {selectedSkills.length} skills selected
                </div>
              </div>

              {/* Experience input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience (Optional)
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Briefly describe your experience level and what you're looking for in teammates..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white h-24 resize-none"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Search button */}
              <button
                onClick={findTeammates}
                disabled={isSearching || selectedSkills.length === 0}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSearching || selectedSkills.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                }`}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Finding Teammates...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Find Teammates
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Results header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">
                  {teammates.length} Potential Teammates Found
                </h3>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Refine Search
                </button>
              </div>

              {/* Results list */}
              {teammates.length > 0 ? (
                <div className="space-y-4">
                  {teammates.map((teammate) => (
                    <div 
                      key={teammate.id}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Profile image */}
                        <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center bg-blue-900">
                            <User size={24} className="text-blue-300" />
                          </div>
                        </div>
                        
                        {/* User info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-white font-medium">{teammate.name}</h4>
                            <div className="bg-blue-900/50 text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                              Match: {formatSimilarity(teammate.similarityScore)}
                            </div>
                          </div>
                          
                          {/* Skills */}
                          <div className="mt-2 flex items-start gap-1">
                            <Code size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {teammate.skills.slice(0, 5).map((skill, index) => (
                                <span 
                                  key={index}
                                  className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                              {teammate.skills.length > 5 && (
                                <span className="text-xs text-gray-400">
                                  +{teammate.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Experience */}
                          {teammate.experience && (
                            <div className="mt-2 flex items-start gap-1">
                              <Briefcase size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-300 line-clamp-2">
                                Experience: {teammate.experience}
                              </p>
                            </div>
                          )}
                          
                          {/* Bio */}
                          {teammate.bio && (
                            <div className="mt-2 flex items-start gap-1">
                              <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-300 line-clamp-2">
                                {teammate.bio}
                              </p>
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => viewProfile(teammate.walletAddress)}
                              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              View Profile
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No matches found</p>
                  <p className="text-gray-500 text-sm mb-6">Try adjusting your skills or experience description</p>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Refine your search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/80">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400">
              Powered by sentence-transformers/all-MiniLM-L6-v2
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 