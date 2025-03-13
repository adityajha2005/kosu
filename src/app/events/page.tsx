"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ExternalLink, AlertCircle, X, Loader2 } from "lucide-react";
import aptos from "../../../public/aptos.png";
import move from "../../../public/move.png"
import web3 from "../../../public/web3game.png"
import blockchain from "../../../public/blockchain.png"


// Define TypeScript interfaces
interface Hackathon {
  id?: string;
  title: string;
  description?: string;
  date?: string;
  stringDate?: string;
  location?: string;
  mode?: string;
  time?: string;
  participants?: number;
  slug?: string;
  image?: string;
  bgColor?: string;
  theme?: string[];
  startDate?: Date;
  status?: string;
  link?: string;
  organiser?: string;
  website?: string;
  imageIndex?: number; // Added to track which image to display
}

export default function EventsPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const images = [aptos, move, web3, blockchain];

  // Fetch hackathons from API
  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/hackathons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch hackathons');
        }
        
        const data = await response.json();
        
        // Process the data to match our component's expected format
        const processedHackathons = data.hackathons.map((hack: Hackathon, index: number) => ({
          id: index.toString(),
          title: hack.title,
          description: hack.theme?.join(', ') || 'Web3 Hackathon',
          date: hack.stringDate || new Date().toLocaleDateString(),
          location: hack.location || 'Virtual',
          time: hack.mode || 'Online',
          participants: hack.participants || 0,
          slug: `hackathon-${index}`,
          image: `/hackathon-${(index % 5) + 1}.jpg`, // Cycle through 5 placeholder images
          bgColor: `bg-gradient-to-r from-blue-${((index % 3) + 1) * 300} to-purple-${((index % 3) + 1) * 300}`,
          link: hack.link,
          imageIndex: index % images.length // Added to select which image to display
        }));
        
        setHackathons(processedHackathons);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        setError("Failed to load hackathons. Please try again later.");
        showNotification("Error", "Failed to load hackathons. Please try again later.", "error");
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
        "You need to connect your Petra wallet to register for hackathons.", 
        "warning"
      );
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.aptos) {
        showNotification(
          "Wallet Not Found", 
          "Petra Wallet not detected. Please install the Petra extension.", 
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
        "Your Petra wallet has been connected successfully!", 
        "success"
      );
    } catch (error) {
      console.error("Failed to connect to Petra Wallet:", error);
      showNotification(
        "Connection Failed", 
        `Failed to connect: ${(error as Error).message}`, 
        "error"
      );
    }
  };

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
              Upcoming Hackathons
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join the most exciting blockchain hackathons and build the future of Web3 with KOSU.
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
              {hackathons.map((hackathon) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Number(hackathon.id) * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                >
                  <div className={`h-48 w-full ${hackathon.bgColor} relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                    {/* Display single image based on hackathon's imageIndex */}
                    <div className="relative h-full w-full">
                      <Image 
                        src={images[hackathon.imageIndex || 0]}
                        alt={hackathon.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold z-10">
                      {hackathon.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-blue-400">{hackathon.title}</h2>
                    <p className="text-gray-300 mb-4">{hackathon.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} className="text-blue-400" />
                        <span>{hackathon.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={16} className="text-blue-400" />
                        <span>{hackathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} className="text-blue-400" />
                        <span>{hackathon.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users size={16} className="text-blue-400" />
                        <span>{hackathon.participants}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link 
                        href={hackathon.link || `/events/${hackathon.slug}`}
                        target={hackathon.link ? "_blank" : "_self"}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white flex-1"
                      >
                        View Details
                        {hackathon.link && <ExternalLink size={16} />}
                      </Link>
                      
                      <Link 
                        href={userAddress ? `/events/${hackathon.slug}/register` : "#"}
                        onClick={(e) => handleRegistration(e, hackathon.slug || "")}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex-1 ${
                          userAddress 
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" 
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {userAddress ? (
                          <>
                            Register
                            <ExternalLink size={16} />
                          </>
                        ) : (
                          "Connect Wallet"
                        )}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string }>;
      disconnect: () => Promise<void>;
      signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
      isConnected: () => Promise<boolean>;
      account: () => Promise<{ address: string }>;
      // Add other Petra wallet methods as needed
    };
  }
}