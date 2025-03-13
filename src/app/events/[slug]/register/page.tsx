"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, X, CheckCircle, Loader2 } from "lucide-react";
import { hacks } from "../../../../data/hackathons";

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    interests: "",
    teamSize: "1",
    agreeToTerms: false
  });

  // Find the hackathon by slug
  const hackathon = hacks.find(h => h.slug === slug);

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
          } else {
            // Redirect to event page if wallet not connected
            router.push(`/events/${slug}`);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };
    
    checkConnection();
  }, [slug, router]);

  // Display toast notification
  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(false), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      showNotification(
        "Terms Required", 
        "You must agree to the terms and conditions to register.", 
        "warning"
      );
      return;
    }
    
    setIsRegistering(true);
    
    try {
      // This would typically be an API call to your backend
      // For now, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store registration in localStorage (in a real app, this would be in a database)
      const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      if (!registeredEvents.includes(slug)) {
        registeredEvents.push(slug);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }
      
      setIsRegistered(true);
      showNotification(
        "Registration Successful", 
        `You have successfully registered for ${hackathon?.title}!`, 
        "success"
      );
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      showNotification(
        "Registration Failed", 
        "There was an error processing your registration. Please try again.", 
        "error"
      );
    } finally {
      setIsRegistering(false);
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

  // If already registered
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-4">Already Registered</h1>
          <p className="text-gray-300 mb-6">
            You have already registered for {hackathon.title}. Check your dashboard for more details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/events/${slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-gray-700 hover:bg-gray-600 text-white"
            >
              <ArrowLeft size={18} />
              Back to Event
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className={`relative py-12 ${hackathon.bgColor}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href={`/events/${slug}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Event Details
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Register for {hackathon.title}
            </h1>
            <p className="text-lg text-white/80 max-w-3xl">
              Complete the form below to secure your spot in this exciting hackathon.
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

      {/* Registration form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-300 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="experience" className="block text-gray-300 font-medium mb-2">Experience Level</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="interests" className="block text-gray-300 font-medium mb-2">Areas of Interest</label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                  placeholder="What blockchain topics are you most interested in?"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="teamSize" className="block text-gray-300 font-medium mb-2">Team Size</label>
                <select
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">Individual (1 person)</option>
                  <option value="2">Small Team (2-3 people)</option>
                  <option value="4">Medium Team (4-5 people)</option>
                </select>
              </div>
              
              <div className="mb-8">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="text-gray-300">
                    I agree to the <Link href="#" className="text-blue-400 hover:underline">terms and conditions</Link> and <Link href="#" className="text-blue-400 hover:underline">code of conduct</Link> for this hackathon.
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/events/${slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex-1"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 