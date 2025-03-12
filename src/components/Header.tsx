"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string }>;
      disconnect: () => Promise<void>;
    };
  }
}


function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  //checking if user is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.aptos) {
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

  const handlePetraWalletConnection = async () => {
    try {
      if (!window.aptos) {
        alert("Petra Wallet not detected.");
        return;
      }

      const response = await window.aptos.connect();
      const { address } = response;

      if (!address) {
        throw new Error("No address found in connection response.");
      }

      //storing address in local storage
      localStorage.setItem('userWalletAddress', address);
      setUserAddress(address);
      
      alert("Petra Wallet Connected Successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to connect to Petra Wallet:", error);
      alert(`Failed to connect: ${(error as Error).message}`);
    }
  };

  const handleLogout = async () => {
    try {
      if (window.aptos) {
        await window.aptos.disconnect();
      }
      localStorage.removeItem('userWalletAddress');
      setUserAddress(null);
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  //=shorten address for display
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">KS</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text"
          >
            KOSU
          </motion.h1>
        </div>

        <nav className="hidden md:flex gap-6">
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="text-gray-400 hover:text-blue-400 font-medium">
              Platform
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/features" className="text-gray-400 hover:text-blue-400 font-medium">
              Features
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/resources" className="text-gray-400 hover:text-blue-400 font-medium">
              Resources
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/events" className="text-gray-400 hover:text-blue-400 font-medium">
              Events
            </Link>
          </motion.div>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {userAddress ? (
            <div className="relative">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {shortenAddress(userAddress)}
                <ChevronDown size={16} />
              </motion.button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                  <Link href="/dashboard">
                    <div className="px-4 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer">
                      Dashboard
                    </div>
                  </Link>
                  <div 
                    className="px-4 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePetraWalletConnection}
            >
              Log in
            </motion.button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="bg-gray-900 border-b border-gray-800 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="/" className="text-gray-400 hover:text-blue-400 font-medium py-2">
                Platform
              </Link>
              <Link href="/features" className="text-gray-400 hover:text-blue-400 font-medium py-2">
                Features
              </Link>
              <Link href="/resources" className="text-gray-400 hover:text-blue-400 font-medium py-2">
                Resources
              </Link>
              <Link href="/events" className="text-gray-400 hover:text-blue-400 font-medium py-2">
                Events
              </Link>
              <div className="flex flex-col gap-4 pt-2">
                {userAddress ? (
                  <>
                    <div className="text-gray-200 font-medium py-2">
                      {shortenAddress(userAddress)}
                    </div>
                    <Link href="/dashboard">
                      <div className="text-gray-400 hover:text-blue-400 font-medium py-2">
                        Dashboard
                      </div>
                    </Link>
                    <div 
                      className="text-gray-400 hover:text-blue-400 font-medium py-2 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={handlePetraWalletConnection} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                  >
                    Log in
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
