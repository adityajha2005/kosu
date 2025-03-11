"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string }>;
    };
  }
}


function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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

      alert("Petra Wallet Connected Successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Failed to connect to Petra Wallet:", error);
      alert(`Failed to connect: ${(error as Error).message}`);
    }
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
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <motion.button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePetraWalletConnection}
          >
            Log in
          </motion.button>
          {/* <motion.button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Sign up for free
          </motion.button> */}
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
              <div className="flex gap-4 pt-2">
                <button onClick={handlePetraWalletConnection} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                >Log in</button>
                {/* <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                >
                  Sign up for free
                </button> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
