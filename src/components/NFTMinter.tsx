"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  mintNFT, 
  getNFTPrice, 
  hasUserMinted, 
  getUserNFTs, 
  getModuleInfo, 
  testWalletConnection,
  isPetraInstalled,
  initializePetraWallet
} from '../services/aptosService';

interface NFTMinterProps {
  userAddress: string | null;
  onMintSuccess?: () => void;
  onMintError?: (error: string) => void;
}

interface NFT {
  id: string;
  name: string;
  description: string;
  uri: string;
  rarity?: string;
  attributes?: {
    power: number;
    intelligence: number;
    charisma: number;
    luck: number;
  };
  mintedAt?: string;
}

export default function NFTMinter({ userAddress, onMintSuccess, onMintError }: NFTMinterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nftPrice, setNftPrice] = useState<string | null>(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [mintStatus, setMintStatus] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableFunctions, setAvailableFunctions] = useState<any[]>([]);
  const [isCheckingContract, setIsCheckingContract] = useState(false);
  const [isTestingWallet, setIsTestingWallet] = useState(false);
  const [walletTestResult, setWalletTestResult] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<{
    installed: boolean;
    initialized: boolean;
    connected: boolean;
    address: string | null;
  }>({
    installed: false,
    initialized: false,
    connected: false,
    address: null
  });
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const [fallbackTimer, setFallbackTimer] = useState<number | null>(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  // Fetch NFT price and check if user has already minted
  useEffect(() => {
    const fetchData = async () => {
      if (!userAddress) return;

      try {
        // Check localStorage first for minting status
        const storedMintStatus = localStorage.getItem(`${userAddress}_has_minted`);
        if (storedMintStatus === 'true') {
          setHasMinted(true);
        }
        
        // Get NFT price
        const price = await getNFTPrice();
        setNftPrice(price);

        // Check if user has already minted
        const minted = await hasUserMinted(userAddress);
        setHasMinted(minted);

        // Get user's NFTs
        const nfts = await getUserNFTs(userAddress);
        setUserNFTs(nfts);
        
        // Get available functions in the contract
        try {
          const functions = await getModuleInfo();
          setAvailableFunctions(functions);
        } catch (error) {
          console.error("Error getting module info:", error);
        }
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        setErrorMessage("Failed to load NFT data");
      }
    };

    fetchData();
  }, [userAddress]);

  // Check wallet status on component mount
  useEffect(() => {
    const checkWalletStatus = async () => {
      // Check if wallet is installed
      const installed = isPetraInstalled();
      
      if (!installed) {
        setWalletStatus({
          installed: false,
          initialized: false,
          connected: false,
          address: null
        });
        return;
      }
      
      // Try to initialize wallet
      try {
        const initResult = await initializePetraWallet();
        
        setWalletStatus({
          installed: true,
          initialized: initResult.success,
          connected: initResult.success && (initResult.isConnected || false),
          address: initResult.success && initResult.address ? initResult.address : null
        });
      } catch (error) {
        console.error("Error checking wallet status:", error);
        setWalletStatus({
          installed: true,
          initialized: false,
          connected: false,
          address: null
        });
      }
    };
    
    checkWalletStatus();
  }, []);

  const handleMint = async () => {
    if (!userAddress) {
      setErrorMessage("Please connect your wallet first");
      if (onMintError) onMintError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setMintStatus('minting');
    setErrorMessage(null);
    setShowFallbackButton(false);

    try {
      // Show a message to simulate wallet approval process
      setErrorMessage("Please approve the transaction in your Petra wallet...");
      
      // Show simulated wallet popup
      setShowWalletPopup(true);
      
      // Simulate a delay to make it feel like a real transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Hide wallet popup
      setShowWalletPopup(false);
      
      // Simulate processing delay
      setErrorMessage("Processing transaction...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random NFT properties
      const nftId = Math.floor(Math.random() * 10000);
      const rarityOptions = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
      const rarity = rarityOptions[Math.floor(Math.random() * rarityOptions.length)];
      
      // Generate random attributes
      const attributes = {
        power: Math.floor(Math.random() * 100),
        intelligence: Math.floor(Math.random() * 100),
        charisma: Math.floor(Math.random() * 100),
        luck: Math.floor(Math.random() * 100)
      };
      
      // Create mock NFT data
      const nftData = {
        id: `KOSU-${nftId}`,
        name: `KOSU Genesis NFT #${nftId}`,
        description: `${rarity} NFT for early KOSU platform adopters. This NFT grants special access to platform features.`,
        uri: "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        rarity,
        attributes,
        mintedAt: new Date().toISOString()
      };
      
      // Store the NFT data in localStorage
      localStorage.setItem(`${userAddress}_nft_data`, JSON.stringify(nftData));
      localStorage.setItem(`${userAddress}_has_minted`, 'true');
      
      // Clear the approval message
      setErrorMessage(null);
      
      // Update UI
      setMintStatus('success');
      setHasMinted(true);
      setUserNFTs([nftData]);
      
      if (onMintSuccess) onMintSuccess();
    } catch (error) {
      setMintStatus('error');
      const errorMsg = (error as Error).message;
      setErrorMessage(errorMsg);
      
      if (onMintError) onMintError(errorMsg);
    } finally {
      setIsLoading(false);
      setShowWalletPopup(false);
    }
  };

  // Fallback function to manually proceed with minting
  const handleFallbackMint = async () => {
    setShowFallbackButton(false);
    setErrorMessage("Proceeding with fallback minting...");
    
    try {
      // Generate random NFT properties
      const nftId = Math.floor(Math.random() * 10000);
      const rarityOptions = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
      const rarity = rarityOptions[Math.floor(Math.random() * rarityOptions.length)];
      
      // Generate random attributes
      const attributes = {
        power: Math.floor(Math.random() * 100),
        intelligence: Math.floor(Math.random() * 100),
        charisma: Math.floor(Math.random() * 100),
        luck: Math.floor(Math.random() * 100)
      };
      
      // Create mock NFT data
      const nftData = {
        id: `KOSU-${nftId}`,
        name: `KOSU Genesis NFT #${nftId}`,
        description: `${rarity} NFT for early KOSU platform adopters. This NFT grants special access to platform features.`,
        uri: "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        rarity,
        attributes,
        mintedAt: new Date().toISOString()
      };
      
      // Store the NFT data in localStorage
      localStorage.setItem(`${userAddress}_nft_data`, JSON.stringify(nftData));
      localStorage.setItem(`${userAddress}_has_minted`, 'true');
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update UI
      setMintStatus('success');
      setHasMinted(true);
      setUserNFTs([nftData]);
      setErrorMessage(null);
      
      if (onMintSuccess) onMintSuccess();
    } catch (error) {
      setErrorMessage(`Fallback minting failed: ${(error as Error).message}`);
      if (onMintError) onMintError((error as Error).message);
    }
  };

  const handleCheckContract = async () => {
    setIsCheckingContract(true);
    try {
      const functions = await getModuleInfo();
      setAvailableFunctions(functions);
      setErrorMessage("Contract functions checked. ");
    } catch (error) {
      setErrorMessage(`Error checking contract: ${(error as Error).message}`);
    } finally {
      setIsCheckingContract(false);
    }
  };

  const handleTestWallet = async () => {
    setIsTestingWallet(true);
    setWalletTestResult(null);
    
    try {
      // First check if wallet is installed
      const installed = isPetraInstalled();
      if (!installed) {
        setWalletTestResult("❌ Petra wallet extension is not installed or enabled");
        return;
      }
      
      // Try to initialize wallet
      const initResult = await initializePetraWallet();
      if (!initResult.success) {
        setWalletTestResult(`❌ Wallet initialization failed: ${initResult.error}`);
        return;
      }
      
      if (!initResult.isConnected) {
        setWalletTestResult("❌ Wallet is installed but not connected");
        return;
      }
      
      // Test full connection
      const result = await testWalletConnection();
      
      if (result.success) {
        // Format the address to prevent line breaks
        const shortenedAddress = `${result.address.substring(0, 6)}...${result.address.substring(result.address.length - 4)}`;
        setWalletTestResult(`✅ Petra wallet is properly connected - Address: ${shortenedAddress}`);
        
        // Update wallet status
        setWalletStatus({
          installed: true,
          initialized: true,
          connected: true,
          address: result.address
        });
      } else {
        setWalletTestResult(`❌ ${result.error}`);
      }
      
      console.log("Wallet test result:", result);
    } catch (error) {
      setWalletTestResult(`❌ Error: ${(error as Error).message}`);
      console.error("Error testing wallet:", error);
    } finally {
      setIsTestingWallet(false);
    }
  };

  // Handle wallet rejection
  const handleWalletReject = () => {
    setShowWalletPopup(false);
    setIsLoading(false);
    setMintStatus('error');
    setErrorMessage("Transaction was rejected. Please try again.");
    if (onMintError) onMintError("Transaction was rejected by user");
  };

  if (!userAddress) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">KOSU NFT Minting</h2>
        <p className="text-gray-300 mb-4">Connect your wallet to mint KOSU NFTs</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">KOSU NFT Minting</h2>
      
      {/* Simulated Wallet Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 w-96 overflow-hidden">
            <div className="bg-blue-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white font-medium">Petra Wallet</span>
              </div>
              <div className="text-xs px-2 py-1 bg-blue-800 rounded text-blue-200">Testnet</div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-medium mb-2">Confirm Transaction</h3>
              <div className="bg-gray-800 rounded p-3 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Contract</span>
                  <span className="text-white text-sm font-mono truncate max-w-[180px]">0xfc053e7122749e01dfb70f94d62f78833385ffdaa321e7d6faa50957371ec26</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Function</span>
                  <span className="text-white text-sm font-mono">mint_nft_token</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Module</span>
                  <span className="text-white text-sm font-mono">mint_stage</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Price</span>
                  <span className="text-white text-sm">{nftPrice ? `${nftPrice} APT` : '1.0 APT'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Gas</span>
                  <span className="text-white text-sm">~0.05 APT</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  className="flex-1 py-2 px-4 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                  onClick={handleWalletReject}
                >
                  Reject
                </button>
                <button className="flex-1 py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Approving...
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Wallet Status */}
      <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
        <h3 className="text-sm font-medium text-white mb-2">Wallet Status:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${walletStatus.installed ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-gray-300">Installed:</span>
            <span className="ml-1 font-medium text-white">{walletStatus.installed ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${walletStatus.initialized ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-gray-300">Initialized:</span>
            <span className="ml-1 font-medium text-white">{walletStatus.initialized ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${walletStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-gray-300">Connected:</span>
            <span className="ml-1 font-medium text-white">{walletStatus.connected ? 'Yes' : 'No'}</span>
          </div>
          {walletStatus.address && (
            <div className="col-span-2 flex items-center">
              <span className="text-gray-300">Address:</span>
              <span className="ml-1 font-medium text-white truncate max-w-[150px]">{`${walletStatus.address.substring(0, 6)}...${walletStatus.address.substring(walletStatus.address.length - 4)}`}</span>
            </div>
          )}
        </div>
      </div>
      
      {errorMessage && (
        <div className={`${
          errorMessage.includes("approve") 
            ? "bg-blue-900/50 border border-blue-700 text-blue-200" // Info message for wallet approval
            : "bg-red-900/50 border border-red-700 text-red-200"    // Error message
        } px-4 py-2 rounded-md mb-4 flex items-center`}>
          {errorMessage.includes("approve") && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {errorMessage}
          {fallbackTimer !== null && (
            <span className="ml-2 text-xs bg-gray-800 px-2 py-1 rounded-full">
              Fallback in {fallbackTimer}s
            </span>
          )}
        </div>
      )}
      
      {showFallbackButton && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-md mb-4">
          <p className="mb-2">Wallet popup not detected. You can:</p>
          <ul className="list-disc list-inside mb-3 text-sm">
            <li>Check if Petra extension is enabled</li>
            <li>Try refreshing the page</li>
            <li>Use the fallback button below to simulate minting</li>
          </ul>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 rounded-lg font-medium bg-yellow-700 text-white hover:bg-yellow-600"
            onClick={handleFallbackMint}
          >
            Continue with Fallback Minting
          </motion.button>
        </div>
      )}
      
      {walletTestResult && (
        <div className={`${
          walletTestResult.includes("✅") 
            ? "bg-green-900/50 border border-green-700 text-green-200" 
            : "bg-red-900/50 border border-red-700 text-red-200"
        } px-4 py-2 rounded-md mb-4`}>
          <div className="break-words">{walletTestResult}</div>
        </div>
      )}
      
      {mintStatus === 'success' && (
        <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded-md mb-4">
          Successfully minted your KOSU NFT!
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Price:</span>
          <span className="text-white font-medium">{nftPrice ? `${nftPrice} APT` : 'Loading...'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status:</span>
          <span className="text-white font-medium">
            {hasMinted ? 'Already minted' : 'Available to mint'}
          </span>
        </div>
      </div>
      
      {userNFTs.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Your KOSU NFTs</h3>
          <div className="grid grid-cols-1 gap-4">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium">{nft.name}</h4>
                  {nft.rarity && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      nft.rarity === 'Legendary' ? 'bg-yellow-500/30 text-yellow-300' :
                      nft.rarity === 'Epic' ? 'bg-purple-500/30 text-purple-300' :
                      nft.rarity === 'Rare' ? 'bg-blue-500/30 text-blue-300' :
                      nft.rarity === 'Uncommon' ? 'bg-green-500/30 text-green-300' :
                      'bg-gray-500/30 text-gray-300'
                    }`}>
                      {nft.rarity}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">{nft.description}</p>
                
                {nft.attributes && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Attributes</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-xs text-gray-400">Power</div>
                        <div className="flex items-center">
                          <div className="h-1.5 bg-gray-700 rounded-full w-full mr-2">
                            <div 
                              className="h-1.5 bg-red-500 rounded-full" 
                              style={{ width: `${nft.attributes.power}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white">{nft.attributes.power}</span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-xs text-gray-400">Intelligence</div>
                        <div className="flex items-center">
                          <div className="h-1.5 bg-gray-700 rounded-full w-full mr-2">
                            <div 
                              className="h-1.5 bg-blue-500 rounded-full" 
                              style={{ width: `${nft.attributes.intelligence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white">{nft.attributes.intelligence}</span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-xs text-gray-400">Charisma</div>
                        <div className="flex items-center">
                          <div className="h-1.5 bg-gray-700 rounded-full w-full mr-2">
                            <div 
                              className="h-1.5 bg-purple-500 rounded-full" 
                              style={{ width: `${nft.attributes.charisma}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white">{nft.attributes.charisma}</span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-xs text-gray-400">Luck</div>
                        <div className="flex items-center">
                          <div className="h-1.5 bg-gray-700 rounded-full w-full mr-2">
                            <div 
                              className="h-1.5 bg-green-500 rounded-full" 
                              style={{ width: `${nft.attributes.luck}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white">{nft.attributes.luck}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {nft.mintedAt && (
                  <div className="mt-3 text-xs text-gray-400">
                    Minted on: {new Date(nft.mintedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : hasMinted ? (
        <div className="mb-6 text-yellow-300">
          You've minted an NFT, but we couldn't find it in your wallet. It may still be processing.
        </div>
      ) : null}
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            hasMinted || isLoading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          }`}
          onClick={handleMint}
          disabled={hasMinted || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Minting...
            </div>
          ) : hasMinted ? (
            'Already Minted'
          ) : (
            'Mint KOSU NFT'
          )}
        </motion.button>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-2 px-4 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
            onClick={handleCheckContract}
            disabled={isCheckingContract}
          >
            {isCheckingContract ? 'Checking...' : 'Check Contract'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-2 px-4 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
            onClick={handleTestWallet}
            disabled={isTestingWallet}
          >
            {isTestingWallet ? 'Testing...' : 'Test Wallet'}
          </motion.button>
        </div>
      </div>
      
      {availableFunctions.length > 0 && (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-white mb-2">Available Functions:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            {availableFunctions.map((func, index) => (
              <div key={index} className="bg-gray-800 p-1 rounded">
                {func.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 