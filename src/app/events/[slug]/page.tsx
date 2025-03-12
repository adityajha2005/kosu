"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Users, Trophy, ExternalLink, AlertCircle, X, ArrowLeft, CheckCircle } from "lucide-react";
import { hackathons } from "../../../data/hackathons";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });
  const [isRegistered, setIsRegistered] = useState(false);

  // Find the hackathon by slug
  const hackathon = hackathons.find(h => h.slug === slug);

  // Check if user wallet is connected and if user is registered
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedAddress = localStorage.getItem('userWalletAddress');
          if (storedAddress) {
            setUserAddress(storedAddress);
            
            // Check if user is registered for this event
            // This would typically be a backend API call
            const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
            if (registeredEvents.includes(slug)) {
              setIsRegistered(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };
    
    checkConnection();
  }, [slug]);

  // Display toast notification
  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(false), 5000);
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

  // If hackathon not found
  if (!hackathon) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-6">The hackathon you're looking for doesn't exist.</p>
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section */}
      <div className={`relative py-20 ${hackathon.bgColor}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {hackathon.title}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl">
              {hackathon.description}
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

      {/* Event details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">About This Hackathon</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {hackathon.longDescription}
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-blue-400">Requirements</h3>
              <ul className="list-disc pl-5 mb-6 text-gray-300 space-y-2">
                {hackathon.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-blue-400">Judges</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                {hackathon.judges.map((judge, index) => (
                  <li key={index}>{judge}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-yellow-400" size={24} />
                <div className="text-xl font-bold text-yellow-400">{hackathon.prizes}</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Date</div>
                    <div>{hackathon.date}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Location</div>
                    <div>{hackathon.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div>{hackathon.time}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Participants</div>
                    <div>{hackathon.participants}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Registration Deadline</div>
                    <div>{hackathon.registrationDeadline}</div>
                  </div>
                </div>
              </div>
              
              {isRegistered ? (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-400 font-medium mb-1">
                    <CheckCircle size={18} />
                    <span>You're registered!</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    You have successfully registered for this hackathon. Check your dashboard for more details.
                  </p>
                </div>
              ) : (
                userAddress ? (
                  <Link 
                    href={`/events/${hackathon.slug}/register`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white mb-4"
                  >
                    Register Now
                    <ExternalLink size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      showNotification(
                        "Wallet Connection Required", 
                        "You need to connect your Petra wallet to register for hackathons.", 
                        "warning"
                      );
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-700 text-gray-400 cursor-not-allowed mb-4"
                  >
                    Connect Wallet to Register
                  </button>
                )
              )}
              
              <Link 
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 