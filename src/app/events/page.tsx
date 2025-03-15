"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ExternalLink, AlertCircle, X, Loader2, User, AtSign } from "lucide-react";
import FindTeammatesModal from "@/components/FindTeammatesModal";

import aptos from "../../../public/aptos.png";

import move from "../../../public/move.png"

import web3 from "../../../public/web3game.png"

import blockchain from "../../../public/blockchain.png"

// Define TypeScript interfaces
interface Hackathon {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  minTeamSize: number;
  maxTeamSize: number;
  organizerName: string;
  organizerEmail: string;
  contactNumber?: string;
  inhouse: boolean;
  outhouse: boolean;
  registrationlink?: string;
  slug?: string;
  imageIndex?: number; // Added to track which image to display
}

export default function HackathonsPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTeammateModalOpen, setIsTeammateModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);

  const images = [aptos, move, web3, blockchain];;

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine if a hackathon is upcoming based on registration deadline
  const isUpcoming = (deadline: string): boolean => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    
    // Set both dates to midnight to compare just the dates without time
    deadlineDate.setHours(23, 59, 59, 999);
    currentDate.setHours(0, 0, 0, 0);
    
    // Return true if deadline is today or in the future
    return deadlineDate >= currentDate;
  };

  // Fetch hackathons from API
  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/hackregister');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hackathons: ${response.status} ${response.statusText}`);
        }
        
        const rawData = await response.json();
        // console.log("Raw API response:", rawData);
        
        // Determine the actual data structure and extract the hackathons array
        let hackathonData;
        
        if (Array.isArray(rawData)) {
          // If response is already an array, use it directly
          hackathonData = rawData;
        } else if (rawData && typeof rawData === 'object') {
          // Check common API response patterns
          if (Array.isArray(rawData.data)) {
            hackathonData = rawData.data;
          } else if (Array.isArray(rawData.hackathons)) {
            hackathonData = rawData.hackathons;
          } else if (Array.isArray(rawData.items)) {
            hackathonData = rawData.items;
          } else if (Array.isArray(rawData.results)) {
            hackathonData = rawData.results;
          } else {
            // If we can't find a standard array property, log the structure and throw error
            console.error("Cannot find hackathons array in response:", rawData);
            throw new Error('Invalid response format: could not locate hackathons array');
          }
        } else {
          throw new Error('Invalid response format: expected array or object');
        }
        
        // console.log("Extracted hackathon data:", hackathonData);
        
        // Process the data to add imageIndex and slug
        const processedHackathons = hackathonData.map((hack, index) => ({
          ...hack,
          id: hack._id ,
          slug: hack._id ,
          imageIndex: index % images.length
        }));
        // console.log("Processed hackathons:", processedHackathons);
        
        setHackathons(processedHackathons);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        setError(`Failed to load hackathons: ${err.message}`);
        showNotification("Error", `Failed to load hackathons: ${err.message}`, "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  // Check if user wallet is connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedAddress = localStorage.getItem('userWalletAddress');
          if (storedAddress) {
            setUserAddress(storedAddress);
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };
    
    checkConnection();
  }, []);

  // Display toast notification
  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(false), 5000);
  };

  // Handle registration attempt
  const handleRegistration = (event: React.MouseEvent, slug: string) => {
    if (!userAddress) {
      event.preventDefault();
      showNotification(
        "Wallet Connection Required", 
        "You need to connect your wallet to register for hackathons.", 
        "warning"
      );
    }
  };

  // Open teammate finder modal
  const openTeammateModal = (hackathon: Hackathon) => {
    if (!userAddress) {
      showNotification(
        "Wallet Connection Required", 
        "You need to connect your wallet to find teammates.", 
        "warning"
      );
      return;
    }
    
    setSelectedHackathon(hackathon);
    setIsTeammateModalOpen(true);
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.aptos) {
        showNotification(
          "Wallet Not Found", 
          "Wallet not detected. Please install the wallet extension.", 
          "error"
        );
        return;
      }

      const response = await window.aptos.connect();
      const { address } = response;

      if (!address) {
        throw new Error("No address found in connection response.");
      }

      localStorage.setItem('userWalletAddress', address);
      setUserAddress(address);
      setShowToast(false);
      
      showNotification(
        "Wallet Connected", 
        "Your wallet has been connected successfully!", 
        "success"
      );
    } catch (error) {
      console.error("Failed to connect to Wallet:", error);
      showNotification(
        "Connection Failed", 
        `Failed to connect: ${(error as Error).message}`, 
        "error"
      );
    }
  };

  // Get gradient color based on index
  const getGradient = (index: number): string => {
    const gradients = [
      "from-blue-600 to-purple-600",
      "from-cyan-600 to-blue-600",
      "from-purple-600 to-pink-600",
      "from-green-600 to-teal-600",
      "from-orange-600 to-red-600"
    ];
    return gradients[index % gradients.length];
  };

  // Mock user skills for the demo
  const userSkills = [
    "JavaScript", "React", "TypeScript", "Node.js", "Blockchain", "Solidity", "Web3"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-blue-900 to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Discover Hackathons
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join the most exciting hackathons and build the future with innovative developers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 backdrop-blur-md border rounded-lg shadow-lg p-4 max-w-md w-full
              ${toastMessage.type === 'success' ? 'bg-green-900/90 border-green-700' : 
                toastMessage.type === 'error' ? 'bg-red-900/90 border-red-700' : 
                toastMessage.type === 'warning' ? 'bg-yellow-900/90 border-yellow-700' : 
                'bg-blue-900/90 border-blue-700'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className={`mt-0.5 flex-shrink-0
                  ${toastMessage.type === 'success' ? 'text-green-400' : 
                    toastMessage.type === 'error' ? 'text-red-400' : 
                    toastMessage.type === 'warning' ? 'text-yellow-400' : 
                    'text-blue-400'}`} 
                />
                <div>
                  <h3 className="font-semibold text-white">{toastMessage.title}</h3>
                  <p className="text-sm mt-1 text-gray-200">{toastMessage.message}</p>
                  {toastMessage.title === "Wallet Connection Required" && (
                    <button
                      onClick={connectWallet}
                      className="mt-3 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={48} className="text-blue-400 animate-spin mb-4" />
          <p className="text-gray-300 text-lg">Loading hackathons...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <p className="text-gray-300 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Hackathons list */}
      {!isLoading && !error && (
        <div className="container mx-auto px-4 py-16">
          {hackathons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-300 text-lg">No hackathons found at the moment. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                >
                  <div className={`h-48 w-full bg-gradient-to-r ${getGradient(index)} relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                    {/* <Image 
                      src={hackathon.imageIndex}
                      alt={hackathon.name}
                      width={500}
                      height={500}
                      /> */}
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-5xl font-bold text-white opacity-20">#{index + 1}</div>
                      </div>
                    </div>
                    <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold z-10">
                      {hackathon.name}
                    </h3>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-blue-400">{hackathon.name}</h2>
                    <p className="text-gray-300 mb-4 line-clamp-2">{hackathon.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} className="text-blue-400" />
                        <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={16} className="text-blue-400" />
                        <span>{hackathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} className="text-blue-400" />
                        <span>Register by: {formatDate(hackathon.registrationDeadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users size={16} className="text-blue-400" />
                        <span>Team: {hackathon.minTeamSize}-{hackathon.maxTeamSize} members</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                      <User size={16} className="text-blue-400" />
                      <span>Organizer: {hackathon.organizerName}</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link 
                        href={`/events/${hackathon.id}`}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white flex-1"
                      >
                        View Details
                      </Link>
                      
                      {isUpcoming(hackathon.registrationDeadline) ? (
                        <div className="flex gap-2 flex-1">
                          <button
                            onClick={() => openTeammateModal(hackathon)}
                            className="flex items-center justify-center gap-1 py-3 px-3 rounded-lg font-medium transition-all duration-300 bg-purple-700 hover:bg-purple-600 text-white"
                          >
                            <Users size={16} />
                          </button>
                          
                          <Link 
                            href={userAddress ? `/events/${hackathon.slug}/register` : "#"}
                            onClick={(e) => handleRegistration(e, hackathon.slug || "")}
                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex-1 ${
                              userAddress 
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" 
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {userAddress ? "Register Now" : "Connect Wallet"}
                            {userAddress && <ExternalLink size={16} />}
                          </Link>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium bg-gray-700 text-gray-400 cursor-not-allowed flex-1"
                        >
                          Registration Closed
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Create Hackathon CTA for organizers */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800/30 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Are you an organizer?</h3>
              <p className="text-gray-300">Create and manage your own hackathon events on our platform.</p>
            </div>
            <Link
              href="/events/hackregister"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center whitespace-nowrap"
            >
              Create a Hackathon
            </Link>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-400">How do I register for a hackathon?</h3>
            <p className="text-gray-300">Connect your wallet, browse the available hackathons, and click on "Register Now" for the event you're interested in. Fill out the required information and submit your registration.</p>
          </div>
          
          <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Can I participate in multiple hackathons?</h3>
            <p className="text-gray-300">Yes, you can register and participate in multiple hackathons as long as their schedules don't conflict and you meet their respective requirements.</p>
          </div>
          
          <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-400">How do I form a team?</h3>
            <p className="text-gray-300">After registering, you can create a team and invite other participants, or join an existing team. Team formation details are available on each hackathon's registration page.</p>
          </div>
          
          <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-400">What if I'm new to hackathons?</h3>
            <p className="text-gray-300">Many hackathons welcome beginners! Look for events labeled as "beginner-friendly" and check out our resources section for guides on how to prepare.</p>
          </div>
        </div>
      </div>
      
      {/* Find Teammates Modal */}
      <FindTeammatesModal
        isOpen={isTeammateModalOpen}
        onClose={() => setIsTeammateModalOpen(false)}
        userSkills={userSkills}
        userId={userAddress || ''}
      />
     
    </div>
  );
}

// TypeScript declaration for wallet
declare global {
  interface Window {
    // @ts-ignore
    aptos?: {
      connect: () => Promise<{ address: string }>;
      disconnect: () => Promise<void>;
      isConnected: () => Promise<boolean>;
      account: () => Promise<{ address: string }>;
    };
  }
}

