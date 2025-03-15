"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Users, Trophy, ExternalLink, AlertCircle, X, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  // console.log("Slug:", slug);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });
  const [isRegistered, setIsRegistered] = useState(false);
  const [hackathon, setHackathon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the specific hackathon by slug
  useEffect(() => {
    const fetchHackathonDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch the specific hackathon by ID/slug
        const response = await fetch('/api/gethack/?id=' + slug);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hackathon: ${response.status} ${response.statusText}`);
        }
        
        const rawData = await response.json();
        console.log("Raw API response:", rawData);
        
        // Handle different possible response formats
        let hackathonData;
        
        // If the response itself is the hackathon object (not an array)
        if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
          // Check if this is the actual hackathon data (has expected fields)
          if (rawData.slug || rawData.id || rawData.name || rawData.title) {
            hackathonData = rawData;
          } 
          // Check if it's nested under a common field
          else if (rawData.data && typeof rawData.data === 'object') {
            hackathonData = rawData.data;
          } 
          else if (rawData.hackathon && typeof rawData.hackathon === 'object') {
            hackathonData = rawData.hackathon;
          }
          else if (rawData.item && typeof rawData.item === 'object') {
            hackathonData = rawData.item;
          }
          else if (rawData.result && typeof rawData.result === 'object') {
            hackathonData = rawData.result;
          }
          // If we can't find it directly, look for any object with title/name
          else {
            // Try to find the first object property that looks like a hackathon
            for (const key in rawData) {
              if (
                typeof rawData[key] === 'object' && 
                rawData[key] !== null && 
                !Array.isArray(rawData[key]) &&
                (rawData[key].title || rawData[key].name)
              ) {
                hackathonData = rawData[key];
                break;
              }
            }
          }
        }
        // If the response is an array
        else if (Array.isArray(rawData)) {
          // Find the hackathon with the matching slug in the array
          hackathonData = rawData.find((h: any) => h.slug === slug || h.id === slug);
        }
        // Check if it's nested in a data structure
        else if (Array.isArray(rawData.data)) {
          hackathonData = rawData.data.find((h: any) => h.slug === slug || h.id === slug);
        }
        else if (Array.isArray(rawData.hackathons)) {
          hackathonData = rawData.hackathons.find((h: any) => h.slug === slug || h.id === slug);
        }
        else if (Array.isArray(rawData.items)) {
          hackathonData = rawData.items.find((h: any) => h.slug === slug || h.id === slug);
        }
        else if (Array.isArray(rawData.results)) {
          hackathonData = rawData.results.find((h: any) => h.slug === slug || h.id === slug);
        }
        
        // If we still couldn't find the hackathon data
        if (!hackathonData) {
          console.error("Response structure:", rawData);
          throw new Error('Could not find hackathon data in the API response');
        }
        
        // Process the hackathon data to ensure it has all required fields
        const processedHackathon = {
          ...hackathonData,
          // Add default values for any fields that might be missing
          title: hackathonData.name || hackathonData.title || "Unnamed Hackathon",
          description: hackathonData.description || "",
          organizerName: hackathonData.organizerName || "Unknown",
          organizerEmail: hackathonData.organizerEmail || "",
          location: hackathonData.location || "Online",
          date: `${formatDate(hackathonData.startDate)} - ${formatDate(hackathonData.endDate)}`,
          time: hackathonData.time || "TBD",
          participants: `${hackathonData.minTeamSize || 1} - ${hackathonData.maxTeamSize || 5} per team`,
          registrationDeadline: formatDate(hackathonData.registrationDeadline),
          bgColor: hackathonData.bgColor || "bg-blue-900",
          theme: hackathonData.theme || ["No specific requirements provided"],
     
          inhouse: hackathonData.inhouse || false,
          outhouse: hackathonData.outhouse || false,
          registrationlink: hackathonData.registrationlink || "",
         
          image: hackathonData.image || ""
        };
        
        setHackathon(processedHackathon);
      } catch (err: any) {
        console.error("Error fetching hackathon details:", err);
        setError(err.message);
        showNotification("Error", `Failed to load hackathon details: ${err.message}`, "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHackathonDetails();
  }, [slug]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "TBD";
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

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
    } catch (error: any) {
      console.error("Failed to connect to Petra Wallet:", error);
      showNotification(
        "Connection Failed",
        `Failed to connect: ${error.message}`,
        "error"
      );
    }
  };

  // Handle registration based on hackathon type
  const handleRegistration = () => {
    if (!userAddress) {
      showNotification(
        "Wallet Connection Required",
        "Please connect your wallet to register for this event",
        "info"
      );
      return;
    }
    
    // For external registration
    if (hackathon.outhouse && hackathon.registrationlink) {
      // Open the external registration link in a new tab
      window.open(hackathon.registrationlink, '_blank');
      return;
    }
    
    // For in-house registration
    if (hackathon.inhouse) {
      // Redirect to internal registration page
      router.push(`/events/${slug}/register`);
      return;
    }
    
    // Default registration flow (if neither outhouse nor inhouse is specified)
    try {
      // Here you would typically make an API call to register the user
      // For demo purposes, we'll just update local storage
      const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      if (!registeredEvents.includes(slug)) {
        registeredEvents.push(slug);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }
      
      setIsRegistered(true);
      showNotification(
        "Registration Successful",
        `You've been registered for ${hackathon.title}!`,
        "success"
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      showNotification(
        "Registration Failed",
        `Failed to register: ${error.message}`,
        "error"
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-blue-400 animate-spin mb-4 mx-auto" />
          <p className="text-gray-300 text-lg">Loading hackathon details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hackathon) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mb-4 mx-auto" />
          <h1 className="text-3xl font-bold text-red-400 mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The hackathon you're looking for doesn't exist."}</p>
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
  
  // Main content when hackathon is loaded
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section */}
      <div className={`relative py-20 ${hackathon.bgColor} bg-cover bg-center`} style={{ backgroundImage: hackathon.image ? `url(${hackathon.image})` : 'none' }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Optional grid overlay */}
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
                  {toastMessage.title=== "Wallet Connection Required" && (
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
                {hackathon.description}
              </p>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Organizers</h3>
              <ul className="list-disc pl-5 mb-6 text-gray-300 space-y-2">
              {Array.isArray(hackathon.organizerName) ? (
                       hackathon.organizerName.map((organizer: string, index: number) => (
               <li key={index}>{organizer}</li>
                          ))
                        ) : (
                          <li>{hackathon.organizerName}</li>
                        )}

              </ul>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Organizer Email</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
              {Array.isArray(hackathon.organizerEmail) ? (
                hackathon.organizerEmail.map((judge: string, index: number) => (
                  <li key={index}>{judge}</li>
                ))
              ) : (
                <li>{hackathon.organizerEmail}</li>
              )}

              </ul>
            </div>
          </div>
          {/* Sidebar */}
          <div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6  top-24">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-yellow-400" size={24} />
                {/* <div className="text-xl font-bold text-yellow-400">{hackathon.prizes}</div> */}
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
                  <Clock className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Time</div>
                    <div>{hackathon.time}</div>
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
                  <Users className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Team Size</div>
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
              
              <div className="border-t border-gray-700 pt-6">
                {isRegistered ? (
                  <div className="flex items-center justify-center gap-2 w-full bg-green-800/50 text-green-300 py-3 px-4 rounded-lg mb-4">
                    <CheckCircle size={20} />
                    <span>You're registered!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleRegistration}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Register for Hackathon
                  </button>
                )}
                
                {!userAddress && (
                  <button
                    onClick={connectWallet}
                    className="w-full mt-3 border border-blue-500 text-blue-400 hover:bg-blue-900/30 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Connect Wallet
                  </button>
                )}
                
                {hackathon.website && (
                  <a
                    href={hackathon.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-3 border border-gray-600 text-gray-300 hover:bg-gray-700/30 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
            
            {/* Share section (optional) */}
            <div className="bg-gray-800/50 backdrop-blur-sm border  border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-200">Share This Hackathon</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: hackathon.title,
                        text: hackathon.description,
                        url: window.location.href,
                      })
                      .catch((error) => console.log('Error sharing', error));
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showNotification(
                        "Link Copied",
                        "Hackathon link copied to clipboard!",
                        "success"
                      );
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar events section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">Related Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated from your API with similar events */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group">
              <div className="h-40 bg-blue-900 bg-opacity-50 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-blue-300 mb-1">Apr 15 - Apr 18, 2025</div>
                  <h3 className="text-lg font-bold text-white">Similar Hackathon Example</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4">Short description of a similar hackathon that might interest participants.</p>
                <Link
                  href="/events/similar-hackathon"
                  className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
            {/* Add more placeholder or dynamically generated event cards as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}