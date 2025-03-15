"use client"
// @ts-nocheck;
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  AtSign, 
  Users, 
  Code, 
  Gift, 
  Award, 
  Send, 
  AlertCircle, 
  CheckCircle,
  User,
  Clock,
  Phone,
  Link
} from 'lucide-react';

interface FormData {
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
  contactNumber: string;
  inhouse: boolean;
  outhouse: boolean;
  registrationlink: string
}

const RegisterHackathon: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    minTeamSize: 1,
    maxTeamSize: 4,
    organizerName: '',
    organizerEmail: '',
    contactNumber: '',
    inhouse: false,
    outhouse: false,
    registrationlink: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // If inhouse is checked, make sure outhouse is unchecked and vice versa
    if (name === 'inhouse' && checked) {
      setFormData(prev => ({
        ...prev,
        inhouse: true,
        outhouse: false,
        registrationlink: '' // Clear registration link when switching to inhouse
      }));
    } else if (name === 'outhouse' && checked) {
      setFormData(prev => ({
        ...prev,
        inhouse: false,
        outhouse: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/hackregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register hackathon');
      }

      setSuccessMessage('Hackathon registered successfully!');
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        location: '',
        minTeamSize: 1,
        maxTeamSize: 4,
        organizerName: '',
        organizerEmail: '',
        contactNumber: '',
        inhouse: false,
        outhouse: false,
        registrationlink: ''
      });
      
      
      // Optional: Redirect after successful submission
     router.push('/events')
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <>
      <Head>
        <title>Register a Hackathon</title>
        <meta name="description" content="Register your hackathon event" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-gray-100">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <span className="inline-block bg-gradient-to-r from-white via-white to-transparent bg-clip-text">
                Register Your Hackathon
              </span>
            </motion.h1>
            <p className="mt-4 text-xl text-gray-300">
              Fill out the form below to register your upcoming hackathon event.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700"
            variants={itemVariants}
          >
            {errorMessage && (
              <motion.div 
                className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div 
                className="bg-green-900/30 border-l-4 border-green-500 p-4 mb-6"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-400">{successMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <motion.div 
                  className="sm:col-span-2"
                  variants={itemVariants}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Hackathon Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                      placeholder="e.g., CodeJam 2025"
                    />
                    <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                    Start Date
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                    />
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                    End Date
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      required
                      value={formData.endDate}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                    />
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-300">
                    Registration Deadline
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      name="registrationDeadline"
                      id="registrationDeadline"
                      required
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                    />
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div 
                  className="sm:col-span-2"
                  variants={itemVariants}
                >
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                    Location
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                      placeholder="e.g., Virtual or San Francisco, CA"
                    />
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div 
                  className="sm:col-span-2"
                  variants={itemVariants}
                >
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border border-gray-600 rounded-md bg-gray-700 text-gray-100"
                      placeholder="Describe your hackathon, its theme, and what participants can expect."
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="minTeamSize" className="block text-sm font-medium text-gray-300">
                    Minimum Team Size
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      name="minTeamSize"
                      id="minTeamSize"
                      min="1"
                      required
                      value={formData.minTeamSize}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                    />
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-300">
                    Maximum Team Size
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      name="maxTeamSize"
                      id="maxTeamSize"
                      min="1"
                      required
                      value={formData.maxTeamSize}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                    />
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                <label htmlFor="organizerName" className="block text-sm font-medium text-gray-300">
                    Organizer Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      name="organizerName"
                      id="organizerName"
                      required
                      value={formData.organizerName}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                    />
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-300">
                    Organizer Email
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      name="organizerEmail"
                      id="organizerEmail"
                      required
                      value={formData.organizerEmail}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                      placeholder="your@email.com"
                    />
                    <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">
                    Contact Number
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="tel"
                      name="contactNumber"
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                      placeholder="e.g., +1 (555) 123-4567"
                    />
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                {/* Registration Type Section */}
                <motion.div className="sm:col-span-2" variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Type
                  </label>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inhouse"
                        name="inhouse"
                        checked={formData.inhouse}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-500 rounded"
                      />
                      <label htmlFor="inhouse" className="ml-2 block text-sm text-gray-300">
                        In-house Registration (use our registration system)
                      </label>
                      {formData.inhouse && (
                        <CheckCircle className="ml-2 h-5 w-5 text-cyan-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="outhouse"
                        name="outhouse"
                        checked={formData.outhouse}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-500 rounded"
                      />
                      <label htmlFor="outhouse" className="ml-2 block text-sm text-gray-300">
                        External Registration (use your own registration link)
                      </label>
                      {formData.outhouse && (
                        <CheckCircle className="ml-2 h-5 w-5 text-cyan-500" />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Conditional Registration Link Field */}
                {formData.outhouse && (
                  <motion.div 
                    className="sm:col-span-2"
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="registrationlink" className="block text-sm font-medium text-gray-300">
                      External Registration Link
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="url"
                        name="registrationlink"
                        id="registrationlink"
                        required={formData.outhouse}
                        value={formData.registrationlink}
                        onChange={handleChange}
                        className="py-3 px-4 pl-10 block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 border-gray-600 rounded-md bg-gray-700 text-gray-100"
                        placeholder="https://your-registration-page.com"
                      />
                      <Link className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div 
                className="mt-10"
                variants={itemVariants}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      Register Hackathon
                    </div>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center text-gray-400 text-sm"
            variants={itemVariants}
          >
            <p>
              By registering your hackathon, you agree to our{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterHackathon;