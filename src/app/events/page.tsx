"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ExternalLink, AlertCircle, X } from "lucide-react";
import { hackathons } from "../../data/hackathons";

export default function EventsPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });

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

      {/* Hackathons list */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hackathons.map((hackathon) => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: hackathon.id * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
            >
              <div className={`h-48 w-full ${hackathon.bgColor} relative overflow-hidden group`}>
                <Image
                  src={hackathon.image}
                  alt={hackathon.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
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
                    href={`/events/${hackathon.slug}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white flex-1"
                  >
                    View Details
                  </Link>
                  
                  <Link 
                    href={userAddress ? `/events/${hackathon.slug}/register` : "#"}
                    onClick={(e) => handleRegistration(e, hackathon.slug)}
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
      </div>
    </div>
  );
}
