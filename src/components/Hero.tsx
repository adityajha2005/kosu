/* eslint-disable react/no-unescaped-entities */
"use client"
// @ts-nocheck;

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  CheckCircle,
  Calendar,
  Users,
  Award,
  Code,
  Briefcase,
  Gift,
  FileCode,
  Database
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';



type AnimationState = {
  "features-section": boolean;
  "feature-demo-section": boolean;
  "user-tabs-section": boolean;
  "active-hackathons": boolean;
};
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


export default function Hero() {
  const [activeTab, setActiveTab] = useState('candidates');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "info" });
  const [animationTriggered, setAnimationTriggered] = useState<AnimationState>({
    "features-section": false,
    "feature-demo-section": false,
    "user-tabs-section": false,
    "active-hackathons": false
  });
  const [activeDemoFeature, setActiveDemoFeature] = useState<FeatureKey >('eventSetup');

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

    const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
      setToastMessage({ title, message, type });
      setShowToast(true);
      // Auto-hide toast after 5 seconds
      setTimeout(() => setShowToast(false), 5000);
    };
  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.75;
        if (sectionTop < triggerPoint) {
          const id = section.id;
          setAnimationTriggered(prev => ({...prev, [id]: true}));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };


 

  // Feature demo content
  const demoFeatures = {
    eventSetup: {
      title: "One-Click Event Creation",
      description: "Create customizable hackathon landing pages with just one click. Set up registration, rules, prizes, and more in minutes.",
      image: "/event.png" 
    },
    teamMatching: {
      title: "AI-Powered Team Matching",
      description: "Our AI analyzes skills, experience, and interests to suggest ideal teammates, making collaboration effortless and productive.",
      image: "/teammatching.png" 
    },
    nftSwags: {
      title: "NFT-Based Event Swags",
      description: "Distribute secure NFT tickets and engagement badges as digital collectibles that showcase participation and achievements.",
      image: "/nft.png" 
    },
    problemStatements: {
      title: "Dynamic Problem Statements",
      description: "Generate tailored challenges based on sponsor needs using AI to ensure relevant and impactful hackathon projects.",
      image: "/problems.png" 
    },
    codeEvaluation: {
      title: "Automated Code Evaluation",
      description: "AI analyzes code quality, functionality, and security before final judging to ensure fair and comprehensive assessment.",
      image: "/code.jpg" 
    },
    smartHiring: {
      title: "AI-Powered Smart Hiring",
      description: "Filter participants using OCEAN personality traits and technical skills to identify ideal candidates for your organization.",
      image: "/hiring.png" 
    }
  };
  type FeatureKey = keyof typeof demoFeatures;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 text-gray-100">
      <Head>
        <title>KOSU | AI-Powered Hackathon Platform</title>
        <meta name="description" content="Seamless hackathon organization platform with AI automation and blockchain rewards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
                    Revolutionizing Hackathons
                  </span> with AI & Blockchain
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-lg mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                  Our AI-driven hackathon platform combines smart automation and blockchain rewards to create efficient, engaging, and fair tech events that connect talent with opportunities.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                >
                  <Link href="/events/hackregister">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 relative overflow-hidden group"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Create Hackathon</span>
                    <ChevronRight size={18} className="relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  </Link>
                  <Link href="/events">
                    <motion.button
                      className="border border-gray-700 bg-gray-800 text-gray-300 px-8 py-3 rounded-lg font-medium"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore Events
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 relative"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-20"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="h-8 bg-gray-900 rounded-t-lg flex items-center gap-2 px-4">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-800 relative">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-200">Hackathon Dashboard</h3>
                      <div className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full">
                        Powered by AI & Blockchain
                      </div>
                    </div>
                    <motion.div
                      className="grid grid-cols-2 gap-4 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.7 }}
                    >
                      <motion.div
                        className="bg-gray-700/50 p-4 rounded-lg"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Active Hackathons</span>
                        </div>
                        <div className="text-2xl font-bold text-white">3</div>
                        <div className="mt-1 text-xs text-gray-400">2 upcoming events</div>
                      </motion.div>
                      <motion.div
                        className="bg-gray-700/50 p-4 rounded-lg"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={16} className="text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">Participants</span>
                        </div>
                        <div className="text-2xl font-bold text-white">557</div>
                        <div className="mt-1 text-xs text-gray-400">+128 this month</div>
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                      whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Upcoming Event Spotlight</span>
                        </div>
                        <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full flex items-center gap-1">
                          <span>NFT Rewards</span>
                        </div>
                      </div>
                      <div className="font-medium text-white mb-2">Web3 Developer Hackathon</div>
                      <div className="flex items-center text-xs text-gray-400 gap-3 mb-2">
                        <span className="flex items-center gap-1"><Calendar size={10} /> April 15-17, 2025</span>
                        <span className="flex items-center gap-1"><Users size={10} /> 245 registered</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Blockchain</div>
                        <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Smart Contracts</div>
                        <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">DeFi</div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6, duration: 0.5 }}
                    >
                      <Link href="/events/web3-developer-hackathon" className="flex-1">
                        <motion.button
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </Link>
                      <Link href="/events/web3-developer-hackathon/register" className="flex-1">
                        <motion.button
                          className="w-full border border-gray-700 bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Register Now
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features-section" className="py-16 bg-gray-800 animate-on-scroll">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              animate={animationTriggered["features-section"] ? "visible" : "hidden"}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Revolutionizing Hackathons</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our platform combines AI automation with blockchain-based rewards to create
                hackathon experiences that are seamless, engaging, and rewarding for all.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate={animationTriggered["features-section"] ? "visible" : "hidden"}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-700 relative group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4 relative">
                  <Calendar className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Seamless Event Setup</h3>
                <p className="text-gray-400">
                  Create customizable hackathon landing pages with one click. Set up registration,
                  rules, and event details in minutes, not days.
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-700 relative group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="w-12 h-12 rounded-lg bg-purple-900/20 flex items-center justify-center mb-4">
                  <Users className="text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Team Matching</h3>
                <p className="text-gray-400">
                  Our AI matches participants based on skills, interests, and location to create
                  balanced teams with complementary abilities.
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-700 relative group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4">
                  <Gift className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">NFT-Based Event Swags</h3>
                <p className="text-gray-400">
                  Distribute digital collectibles as secure NFT tickets and achievement badges that
                  participants can showcase and use for future events.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
              variants={staggerContainer}
              initial="hidden"
              animate={animationTriggered["features-section"] ? "visible" : "hidden"}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-700 relative group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="w-12 h-12 rounded-lg bg-green-900/20 flex items-center justify-center mb-4 relative">
                  <Database className="text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Dynamic Problem Statements</h3>
                <p className="text-gray-400">
                  Generate tailored challenges based on sponsor requirements and market needs
                  to ensure hackathon projects have real-world impact.
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-700 relative group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl blur opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="w-12 h-12 rounded-lg bg-yellow-900/20 flex items-center justify-center mb-4">
                  <FileCode className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Automated Code Evaluation</h3>
                <p className="text-gray-400">
                  AI analyzes code quality, functionality, and security before final judging
                  to ensure fair and comprehensive project assessment.
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-700 relative group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="w-12 h-12 rounded-lg bg-red-900/20 flex items-center justify-center mb-4">
                  <Briefcase className="text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Smart Hiring</h3>
                <p className="text-gray-400">
                  Filter participants using OCEAN personality traits and verified skills to identify 
                  ideal candidates for your organization's needs.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Feature Demo Section */}
        <section id="feature-demo-section" className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white animate-on-scroll">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
              initial="hidden"
              animate={animationTriggered["feature-demo-section"] ? "visible" : "hidden"}
            >
              <h2 className="text-3xl font-bold mb-4">See Our Platform in Action</h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Experience how our AI and blockchain features transform the hackathon experience for organizers and participants alike.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 overflow-hidden border border-gray-700/50">
                <ul className="space-y-2">
                  {Object.keys(demoFeatures).map((feature) => (
                    <motion.li 
                      key={feature}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ${activeDemoFeature === feature ? 'bg-blue-600/30 border border-blue-500/50' : 'hover:bg-gray-700/30'}`}
                      onClick={() => setActiveDemoFeature(feature as FeatureKey)}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {feature === 'eventSetup' && <Calendar size={20} className="text-blue-400" />}
                      {feature === 'teamMatching' && <Users size={20} className="text-purple-400" />}
                      {feature === 'nftSwags' && <Gift size={20} className="text-green-400" />}
                      {feature === 'problemStatements' && <Database size={20} className="text-yellow-400" />}
                      {feature === 'codeEvaluation' && <Code size={20} className="text-red-400" />}
                      {feature === 'smartHiring' && <Briefcase size={20} className="text-blue-400" />}
                      <span>{demoFeatures[feature as FeatureKey].title}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="md:col-span-2">
                <motion.div 
                  className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 h-full"
                  key={activeDemoFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{demoFeatures[activeDemoFeature ].title}</h3>
                    <p className="text-blue-200">{demoFeatures[activeDemoFeature].description}</p>
                  </div>
                  
                  <div className="mt-6 bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50 group">
                    <Image
                      src={demoFeatures[activeDemoFeature].image} 
                      alt={demoFeatures[activeDemoFeature].title}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      width={1000}
                      height={500}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* User Tabs Section */}
        <section id="user-tabs-section" className="py-16 bg-gray-900 animate-on-scroll">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              animate={animationTriggered["user-tabs-section"] ? "visible" : "hidden"}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">For Every Stakeholder</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                KOSU creates value for everyone involved in the hackathon ecosystem, from organizers to participants.
              </p>
            </motion.div>

            <div className="mb-8 flex justify-center">
              <div className="inline-flex bg-gray-800 rounded-lg p-1">
                <motion.button
                  className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === 'organizers' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('organizers')}
                  whileHover={activeTab !== 'organizers' ? { backgroundColor: "rgba(37, 99, 235, 0.1)" } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  For Organizers
                </motion.button>
                <motion.button
                  className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === 'candidates' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('candidates')}
                  whileHover={activeTab !== 'candidates' ? { backgroundColor: "rgba(37, 99, 235, 0.1)" } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  For Candidates
                </motion.button>
                <motion.button
                  className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === 'sponsors' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('sponsors')}
                  whileHover={activeTab !== 'sponsors' ? { backgroundColor: "rgba(37, 99, 235, 0.1)" } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  For Sponsors
                </motion.button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'organizers' && (
                <motion.div
                  key="organizers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-white">Organize Hackathons with Ease</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Streamlined Setup Process</h4>
                          <p className="text-gray-400">Create your hackathon landing page, registration forms, and event rules in minutes with our intuitive builder.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Automated Participant Management</h4>
                          <p className="text-gray-400">Let our AI handle participant communication, team formation, and submission tracking while you focus on event quality.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Transparent Judging System</h4>
                          <p className="text-gray-400">Utilize our blockchain-based judging to ensure fair, transparent evaluation of all submissions.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group">
                    <Image 
                      src="/organizer.png" 
                      alt="Organizer Dashboard" 
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105" 
                      width={1000}
                      height={500} 
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'candidates' && (
                <motion.div
                  key="candidates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-white">Showcase Your Skills & Talent</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Find Your Ideal Team</h4>
                          <p className="text-gray-400">Connect with compatible teammates based on your skills, interests, and goals using our AI matching system.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Build Your Tech Portfolio</h4>
                          <p className="text-gray-400">Earn verified NFT credentials and build a blockchain-backed portfolio of your hackathon achievements.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Connect with Employers</h4>
                          <p className="text-gray-400">Get discovered by top tech companies through our talent marketplace that showcases your verified skills.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group">
                    <Image 
                      src="/candidate.png" 
                      alt="Candidate Profile" 
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105" 
                      width={1000}
                      height={500}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'sponsors' && (
                <motion.div
                  key="sponsors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-white">Find & Attract Top Tech Talent</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Custom Challenge Creation</h4>
                          <p className="text-gray-400">Design challenges aligned with your business needs to identify talent with skills relevant to your organization.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">AI-Powered Talent Filtering</h4>
                          <p className="text-gray-400">Use our advanced AI to filter candidates based on technical skills, soft skills, and personality traits.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle size={20} className="text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Verified Skill Assessment</h4>
                          <p className="text-gray-400">Access candidates with verified blockchain credentials showing their skills and hackathon achievements.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group">
                    <Image 
                      src="/sponsor.png" 
                      alt="Sponsor Dashboard" 
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105" 
                      width={1000}
                      height={500}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Active Hackathons Section */}
        <section id="active-hackathons" className="py-16 bg-gradient-to-br from-blue-900/30 to-gray-900 animate-on-scroll">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              animate={animationTriggered["active-hackathons"] ? "visible" : "hidden"}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Active Hackathons</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join these ongoing and upcoming events to showcase your skills, collaborate with fellow developers, and win rewards.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hackathons.slice(0, 2).map((hackathon) => (
                <motion.div
                  key={hackathon.id}
                  className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 group relative"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full inline-block mb-2">
                          {hackathon.description}
                        </div>
                        <h3 className="text-xl font-bold text-white">{hackathon.title}</h3>
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs bg-purple-900/50 text-purple-400 px-2 py-1 rounded-full flex items-center gap-1">
                          <Gift size={12} />
                        
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <Calendar size={16} className="mr-2" />
                        <span>{hackathon.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users size={16} className="mr-2" />
                        <span>{hackathon.participants} Participants Registered</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-6">
                      <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">{hackathon.location}</div>
                      <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">{hackathon.time}</div>
                    </div>
                    <div className="flex gap-2">
                      <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="flex-1 relative">
                        <motion.button
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </a>
                      <a href={`${hackathon.link}/register`} target="_blank" rel="noopener noreferrer" className="flex-1 relative">
                        <motion.button
                          className="w-full border border-gray-700 bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Register Now
                        </motion.button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/events">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Hackathons
                  <ChevronRight size={18} />
                </motion.button>
              </Link>
            </div>
          </div>

          

          
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-800/50 to-purple-800/50"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl"></div>
          </motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                className="text-4xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Ready to Transform Your Hackathon Experience?
              </motion.h2>
              <motion.p
                className="text-blue-200 text-lg mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Join thousands of organizers, participants, and sponsors who are already using KOSU to create impactful tech events and discover opportunities.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                
              </motion.div>
            </div>
          </div>
        </section>
      </main>

 
    </div>
  );
}