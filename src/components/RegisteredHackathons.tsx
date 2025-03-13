"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, ChevronRight, Award } from 'lucide-react';
import { hacks } from '../data/hackathons';

interface RegisteredHackathonsProps {
  userAddress: string | null;
}

export default function RegisteredHackathons({ userAddress }: RegisteredHackathonsProps) {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [userHackathons, setUserHackathons] = useState<typeof hacks>([]);
  
  // Fetch registered events from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && userAddress) {
      try {
        const storedEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
        setRegisteredEvents(storedEvents);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      }
    }
  }, [userAddress]);
  
  // Filter hackathons to show only registered ones
  useEffect(() => {
    if (registeredEvents.length > 0) {
      const userRegisteredHackathons = hacks.filter(hackathon => 
        registeredEvents.includes(hackathon.slug)
      );
      setUserHackathons(userRegisteredHackathons);
    }
  }, [registeredEvents]);

  if (!userAddress) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Your Hackathons</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">Connect your wallet to view registered hackathons</p>
        </div>
      </div>
    );
  }

  if (userHackathons.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Your Hackathons</h2>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">You haven't registered for any hackathons yet</p>
          <Link 
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
          >
            Browse Hackathons
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-400">Your Hackathons</h2>
        <Link 
          href="/events"
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="space-y-4">
        {userHackathons.map((hackathon) => (
          <motion.div
            key={hackathon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${hackathon.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Award className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{hackathon.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-blue-400" />
                    <span>{hackathon.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-blue-400" />
                    <span>{hackathon.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-400">
                Registration complete
              </div>
              <Link 
                href={`/events/${hackathon.slug}`}
                className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
              >
                View Details
                <ExternalLink size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 